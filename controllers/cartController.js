import { getClient, query } from "../db/index.js";

export const createCart = async (req, res) => {
    try {
        let result = await query("SELECT id FROM carts WHERE user_id = $1;", [req.user.id]);
        if (result.rows.length === 0) {
            result = await query("INSERT INTO carts (user_id) VALUES ($1) RETURNING id;", [req.user.id]);
        }
        return res.status(201).json({ cart_id: result.rows[0].id });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const changeCartItems = async (req, res) => {
    const { cart_id } = req.params;
    const { product_id, qty = 1 } = req.body;
    if (!cart_id || !product_id || !qty) {
        return res.sendStatus(400);
    }
    try {
        await query("INSERT INTO cart_items (cart_id, product_id, qty) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET qty = cart_items.qty + EXCLUDED.qty", [cart_id, product_id, qty]);
        return res.status(201).json({ message: "Produto novo adicionado no carrinho com sucesso!" });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const changeItemQty = async (req, res) => {
    const { cart_id, product_id } = req.params;
    const { qty } = req.body;
    if (!cart_id || !product_id) {
        res.sendStatus(400);
    } 
    try {
        await query("UPDATE cart_items SET qty = $1 WHERE product_id = $2 AND cart_id = $3;", [qty, product_id, cart_id]);
        res.sendStatus(200);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const deleteCartItem = async (req, res) => {
    const { cart_id, product_id } = req.params;
    if (!cart_id || !product_id) {
        res.sendStatus(400);
    } 
    try {
        await query("DELETE FROM cart_items WHERE product_id = $1 AND cart_id = $2;", [product_id, cart_id]);
        res.sendStatus(204);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const getCart = async (req, res) => {
    const { cart_id } = req.params;
    if (!cart_id) {
        res.sendStatus(400);
    }
    try {
        const result = await query(
            `SELECT cart_items.product_id, cart_items.qty, products.name, products.price_cents, products.description
             FROM cart_items
             JOIN products ON cart_items.product_id = products.id
             WHERE cart_items.cart_id = $1;`,
            [cart_id]
        );
        res.status(200).json(result.rows);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const checkout = async (req, res) => {
    const { cart_id } = req.params;

    const client = await getClient();
    try {
        await client.query('BEGIN');

        /* 1. get cart lines with price snapshot */
        const { rows: cartItems } = await client.query(
            `SELECT ci.product_id,
                    ci.qty,
                    p.price_cents AS unit_price_cents
                FROM cart_items  ci
                JOIN products    p ON p.id = ci.product_id
                WHERE ci.cart_id = $1`,
            [cart_id]
        );

        if (cartItems.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Cart is empty' });
        }

        /* 2. create order */
        const { rows:[order] } = await client.query(
            `INSERT INTO orders (user_id, order_status, created_at, updated_at)
            VALUES ($1, 'pending', now(), now())
            RETURNING id`,
            [req.user.id]
        );
        const orderId = order.id;

        /* 3. bulk-insert order_items --------------------------------------- */
        /* build VALUES list: ($1,$2,$3,$4), ….  */
        const values = cartItems.flatMap((it, i) => [
            orderId,
            it.product_id,
            it.unit_price_cents,
            it.qty
        ]);
        const placeholders = cartItems
            .map((_, i) => `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`)
            .join(', ');

        await client.query(
            `INSERT INTO order_items
                (order_id, product_id, unit_price_cents, qty)
            VALUES ${placeholders}`,
            values
        );

        /* 4. compute total inside the DB for accuracy */
        const { rows:[{ total }] } = await client.query(
            `SELECT SUM(qty * unit_price_cents)::bigint AS total
                FROM order_items
                WHERE order_id = $1`,
            [orderId]
        );

        await client.query(
            `UPDATE orders
                SET total_amount_cents  = $2,
                    shipping_cost_cents = 0,        -- calculate here if needed
                    tax_amount_cents    = 0,
                    updated_at          = now()
                WHERE id = $1`,
            [orderId, total]
        );

        /* 5. mark cart as checked-out + empty items (optional keep for audit) */

        await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cart_id]);

        await client.query('COMMIT');
        return res.status(201).json({ order_id: orderId, total_cents: total });

    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};
import { query } from "../db/index.js";

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
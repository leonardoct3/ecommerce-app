import { query } from "../db/index.js";

export const getOrders = async (req, res) => {
    const id = req.user.id;
    console.log(id);
    try {
        let result = await query(`
            SELECT 
            o.order_status, 
            o.total_amount_cents, 
            o.shipping_cost_cents, 
            o.tax_amount_cents, 
            p.id AS product_id,
            p.name, 
            p.price_cents, 
            p.description,
            oi.unit_price_cents
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
        `, [id]);
        return res.status(200).json(result.rows);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const getOrder = async (req, res) => {
    const { order_id } = req.params;
    const { id } = req.user;
    try {
        let result = await query(` 
            SELECT 
            o.order_status, 
            o.total_amount_cents, 
            o.shipping_cost_cents, 
            o.tax_amount_cents, 
            p.id AS product_id,
            p.name, 
            p.price_cents, 
            p.description,
            oi.unit_price_cents
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1 AND o.user_id = $2`, [order_id, id]);
        return res.status(200).json(result.rows);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
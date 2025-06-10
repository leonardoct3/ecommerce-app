import { query } from "../db/index.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price_cents, description, stock_qty = 0, sku } = req.body;
        if (!price_cents || !name) {
            return res.status(500).json({ message: "Informações faltantes"});
        }  
        await query("INSERT INTO products (name, price_cents, description, stock_qty, sku) VALUES ($1, $2, $3, $4, $5);", [name, price_cents, description, stock_qty, sku]);
        return res.status(201).json({ message: "Produto criado com sucesso" });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const alterProduct = async (req, res) => {
    try {
        const { name, price_cents, description, stock_qty, sku } = req.body;
        if (!name || !price_cents || stock_qty === undefined) {
            return res.status(400).json({ message: "Campos obrigatórios ausentes" });
        }

        if (!req.params.id) {
            return res.status(400).json({ message: "ID do produto não informado" });
        }
        const updatedAt = new Date().toISOString();
        await query(
            "UPDATE products SET name = $1, price_cents = $2, description = $3, stock_qty = $4, sku = $5, updated_at = $6 WHERE id = $7;",
            [name, price_cents, description, stock_qty, sku, updatedAt, req.params.id]
        );
        return res.status(200).json({ message: "Produto alterado com sucesso" });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
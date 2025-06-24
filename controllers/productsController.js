import { query } from "../db/index.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price_cents, description, stock_qty = 0, sku, category_id } = req.body;
        if (!price_cents || !name) {
            return res.status(500).json({ message: "Informações faltantes"});
        }  
        await query("INSERT INTO products (name, price_cents, description, stock_qty, sku, category_id) VALUES ($1, $2, $3, $4, $5, $6);", [name, price_cents, description, stock_qty, sku, category_id]);
        return res.status(201).json({ message: "Produto criado com sucesso" });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const alterProduct = async (req, res) => {
    try {
        const { name, price_cents, description, stock_qty, sku, category_id } = req.body;
        if (!name || !price_cents || stock_qty === undefined) {
            return res.status(400).json({ message: "Campos obrigatórios ausentes" });
        }

        if (!req.params.id) {
            return res.status(400).json({ message: "ID do produto não informado" });
        }
        const updatedAt = new Date().toISOString();
        await query(
            "UPDATE products SET name = $1, price_cents = $2, description = $3, stock_qty = $4, sku = $5, updated_at = $6, category_id = $7 WHERE id = $8;",
            [name, price_cents, description, stock_qty, sku, updatedAt, category_id, req.params.id]
        );
        return res.status(200).json({ message: "Produto alterado com sucesso" });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID do produto não informado "});
        }
        await query("DELETE FROM products WHERE id = $1;", [id]);
        return res.sendStatus(204);
    } catch(e) {
        return res.status(500).json({ error: e.message });
    }
}

export const getProduct = async (req, res) => {
    try {
        const { category } = req.query;
        let result;
        if (category) {
            result = await query("SELECT * FROM products WHERE category_id = $1;", [category]);
        } else {
            result = await query("SELECT * FROM products;");
        }
        return res.status(200).json(result.rows);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
import { query } from "../db/index.js";
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.sendStatus(400);
    }
    try {
        const salt = 10;
        const hashPassword = await bcrypt.hash(password, salt);

        await query('INSERT INTO USERS (name, email, password) VALUES ($1, $2, $3)', [name, email, hashPassword]);

        return res.sendStatus(201);
    } catch (e) {
        console.error(e.message);
        return res.sendStatus(500);
    }
}

export const getUsers = async (req, res) => {
    try {
        let result = await query("SELECT * FROM users;");
        return res.status(200).json(result.rows);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "ID não enviado" });
        }
        let result = await query("SELECT * FROM users WHERE id = $1;", [id]);
        res.status(200).json(result.rows[0]);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "ID não enviado" });
        }
        await query("DELETE FROM users WHERE id = $1;", [id]);

        return res.sendStatus(204);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            req.sendStatus(400);
        }
        const updatedAt = new Date().toISOString();
        await query("UPDATE users SET name = $1, updated_at = $2 WHERE id = $3;", [name, updatedAt, id]);
        return res.sendStatus(200);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
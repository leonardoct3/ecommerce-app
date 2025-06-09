import { query } from "../db/index.js";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.sendStatus(400);
    }
    try {
        const { rows } = await query('INSERT INTO USERS (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
        res.sendStatus(201);
    } catch (e) {
        console.error(e.message);
        res.sendStatus(500);
    }
}
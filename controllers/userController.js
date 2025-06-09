import { query } from "../db/index.js";
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.sendStatus(400);
    }
    try {
        const salt = 10;
        const hashPassword = await bcrypt.hash(JSON.stringify(password), salt);

        await query('INSERT INTO USERS (name, email, password) VALUES ($1, $2, $3)', [name, email, hashPassword]);

        res.sendStatus(201);
    } catch (e) {
        console.error(e.message);
        res.sendStatus(500);
    }
}
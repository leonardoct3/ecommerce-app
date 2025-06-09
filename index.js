import express from 'express';
import { query } from './db/index.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.get('/health', async (req, res) => {
    const { rows } = await query('SELECT 1 AS ok');
    res.json(rows[0]);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
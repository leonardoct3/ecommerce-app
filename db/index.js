import { Pool } from 'pg';

const pool = new Pool();

export const query = async (text, params) => {
    // const start = Date.now()
    const res = await pool.query(text, params)
    // const duration = Date.now() - start
    // console.log('executed query', { text, duration, rows: res.rowCount })
    // if (params && params.length) {
    //     console.log('with parameters', params);
    // }
    return res
}
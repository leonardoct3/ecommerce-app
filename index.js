import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/', userRoutes);

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`\nEcommerce app listening on port ${PORT}\n`);
})
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productsRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import morgan from 'morgan';
import { configurePassport } from './middlewares/auth.js';
import passport from 'passport';
import session from 'express-session'

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())
configurePassport(passport)

app.use('/', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`\nEcommerce app listening on port ${PORT}\n`);
})
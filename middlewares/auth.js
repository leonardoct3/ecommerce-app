import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { query } from '../db/index.js';

export function configurePassport(passport) {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
			try {
				const { rows } = await query('SELECT * FROM public.users WHERE email = $1;', [email]);
				const user = rows[0];
				// console.log('User:', JSON.stringify(user, null, 2));


				if (!user) return done(null, false, { message: 'Usuário não encontrado' });
				// console.log(`Comparing ${password} with ${user.password}`);
				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) return done(null, false, { message: 'Senha incorreta' });

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const res = await query('SELECT * FROM users WHERE id = $1', [id]);
			done(null, res.rows[0]);
		} catch (err) {
			done(err);
		}
	});
}

export const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated && req.isAuthenticated()) {
		return next();
	}
	return res.status(401).json({ message: "Não autenticado" });
}
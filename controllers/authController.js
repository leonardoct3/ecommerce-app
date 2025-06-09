import passport from "passport";

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ message: "Login efetuado com sucesso" });
        });
    })(req, res, next);
}

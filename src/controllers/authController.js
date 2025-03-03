const AuthService = require("../services/authService");

const AuthController = {
    async signup(req, res, next) {
        try {
            const user = await AuthService.signupUser(req)
            const { _id, email, username } = user;

            res.status(201).json({ message: "user signed up successfully ", data: { _id, email, username } })
        } catch (error) {
            next(error)
        }
    },

    async login(req, res, next) {
        try {
            const user = await AuthService.loginUser(req);
        } catch (error) {
            next(error)
        }

    }
}
module.exports = AuthController

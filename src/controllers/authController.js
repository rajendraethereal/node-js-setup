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
            res.status(200).json({ message: "user login successfully ", data: user })
        } catch (error) {
            next(error)
        }
    },

    async refreshToken(req, res, next) {
        try {
            const user = await AuthService.refreshToken(req);
            res.status(200).json({ message: "request token successfully ", data: user })
        } catch (error) {
            next(error)
        }
    },

    async logout(req, res, next) {
        try {
            const logout = await AuthService.logout(req);
            res.status(200).json(logout)
        } catch (error) {
            next(error)
        }

    }
}
module.exports = AuthController

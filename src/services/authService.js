const authModel = require('../models/authModel');

class AuthService {

    static async signupUser(req) {
        const { username, email, password } = req.body;
        const existingUser = await authModel.findOne({ email })

        if (existingUser) {
            const error = new Error("user aleredy exists");
            error.statusCode = 400;
            throw error;
        }

        return await authModel.create({ username, email, password });
    }
}
module.exports = AuthService




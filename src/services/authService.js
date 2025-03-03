const authModel = require('../models/authModel');
const bcrypt = require('bcrypt');
class AuthService {

    static async signupUser(req) {
        const { username, email, password } = req.body;
        const existingUser = await authModel.findOne({ email })

        if (existingUser) {
            const error = new Error("user aleredy exists");
            error.statusCode = 400;
            throw error;
        }

        const hashPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUND))
        return await authModel.create({ username, email, password: hashPassword });
    }
}
module.exports = AuthService




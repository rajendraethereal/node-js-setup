const authModel = require('../models/authModel');
const bcrypt = require('bcrypt');
const { default: AppError } = require('../utils/AppError');
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

    static async loginUser(req){
        const {email,password} = req.body

        const user = authModel.findOne({email});
        if(!user){
            throw new AppError("User already exists", 400);
        }

        const hashPassword = await bcrypt.compare(user.password,password);
        if(!hashPassword){
            throw new AppError("Password does not match", 400);
        }



    }
}
module.exports = AuthService




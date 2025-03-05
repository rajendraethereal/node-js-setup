const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const AppError = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenGenerate');

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

    static async loginUser(req) {
        const { email, password } = req.body

        const user = await authModel.findOne({ email });

        if (!user) {
            throw new AppError("email not exists", 400);
        }

        const hashPassword = await bcrypt.compare(password, user.password);
        if (!hashPassword) {
            throw new AppError("Password does not match", 400);
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        user.save();

        return { id: user._id, name: user.username, email, accessToken, refreshToken }

    }

    static async refreshToken(req) {

        const token = req.headers["authorization"];
        if (!token) throw new AppError("Access Denied", 400);

        jwt.verify(token.split(" ")[1], process.env.REFRESH_SECRET, (err, decoded) => {
            if (err) throw new AppError("Invalid Token", 400);
            req.user = decoded;
        });

        const accessToken = generateAccessToken(req.user.id);
        
        return accessToken
    }
}
module.exports = AuthService




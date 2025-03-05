const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const AppError = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenGenerate');
const redisClient = require('../utils/redisClient.js');

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

        await redisClient.sadd(user._id.toString(), refreshToken);
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

        const verifyToken = await redisClient.get(req.user.id);

        if (verifyToken !== token.split(" ")[1]) throw new AppError("Invalid Token", 400)

        const accessToken = generateAccessToken(req.user.id);

        return accessToken
    }

    static async logout(req) {
        const token = req.headers["authorization"];
        const accessToken = token.split(" ")[1]

        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
            if (err) throw new AppError("Invalid Token", 400);
            req.user = decoded;
        });

        const expiryTime = decodedAccessToken.exp - Math.floor(Date.now() / 1000);

        if (expiryTime > 0) {
            await redisClient.sadd(`blacklist:${req.user.id}`, `blacklist:${accessToken}`, "EX", expiryTime);
        }

        const data = await redisClient.del(req.user.id);

        if (!data) throw new AppError("Session expired or logged in from another device");

        return { message: "successfully logout" }
    }
}
module.exports = AuthService




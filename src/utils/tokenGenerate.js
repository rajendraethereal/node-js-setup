const jwt = require('jsonwebtoken')
// Generate Access Token
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRY,
    });
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_EXPIRY,
    });
};

module.exports = { generateAccessToken, generateRefreshToken }
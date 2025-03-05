const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
})

module.exports = mongoose.model('Auth', authSchema)
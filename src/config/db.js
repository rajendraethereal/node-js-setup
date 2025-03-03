const mongoose = require("mongoose");

const conn = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("connection created.")
        }).catch((err) => {
            console.log("Error ", err)
        })
}

module.exports = conn


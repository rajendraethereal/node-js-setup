const mongoose = require("mongoose");

const conn = () => {
    console.log("process connection value ",process.env.MONGO_URI)
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("connection created.")
        }).catch((err) => {
            console.log("Error ", err)
        })
}

module.exports = conn


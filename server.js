const express = require('express');
const conn = require('./src/config/db');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json())

app.post("/create", (req, res) => {
    res.send("create post")
})
app.get("/read", (req, res) => {
    res.send("read post")
})
app.put("/update", (req, res) => {
    res.send("update post")
})
app.delete("/delete", (req, res) => {
    res.send("delete post")
})

app.listen(5000, () => {
    console.log("Start")
    conn();
})

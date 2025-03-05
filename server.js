const express = require('express');
const conn = require('./src/config/db');
const dotenv = require('dotenv');
const authRouter = require('./src/routes/authRoute');
const protectedRoute = require('./src/routes/protectedRoute');
const errorHandler = require('./src/middlewares/errorMiddleware');

const app = express();
dotenv.config();

app.use(express.json())

app.use("/auth", authRouter)
app.use("/api", protectedRoute)

app.use(errorHandler);

app.listen(5000, () => {
    console.log("Start")
    conn();
})

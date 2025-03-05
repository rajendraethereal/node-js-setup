const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.get('/refresh-token', AuthController.refreshToken);
router.get('/logout', AuthController.logout);


module.exports = router;
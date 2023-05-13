const express = require('express');
const { registroUser, mostrarUser, login, googlelogin } = require('../controller/user');
const verifyToken = require('../middleware/jwt');

const route = express.Router();

route.get("/user", verifyToken, mostrarUser)
route.post("/register", registroUser)
route.post("/login", login)
route.post("/googlelogin",  googlelogin)

module.exports = route;
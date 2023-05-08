const express = require('express');
const { registroUser, mostrarUser, login } = require('../controller/user');
const verifyToken = require('../middleware/jwt');

const route = express.Router();

route.get("/user", verifyToken, mostrarUser)
route.post("/register", registroUser)
route.post("/login", login)

module.exports = route;
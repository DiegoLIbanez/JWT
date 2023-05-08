const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const {DB_USER, DB_PASS, DB_HOST, DB_NAME} = process.env

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`, {logging: false});

module.exports = {sequelize};
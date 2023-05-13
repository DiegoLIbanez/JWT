const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

 const User =  sequelize.define('User',{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true 
    },
    name: {
        type : DataTypes.STRING,
        allowNull : false
    },
    email: { 
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password: {
        type : DataTypes.STRING,
        allowNull : false
    },
    createGoogle: {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    token: {
        type : DataTypes.STRING
    },
    cuentaConfirmada: {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    }
}, {
    freezeTableName: true
});


module.exports = User
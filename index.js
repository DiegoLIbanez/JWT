const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const  {sequelize}  = require('./db/db');

dotenv.config();
const server = express();
server.use(morgan('common'));
server.use(bodyParser.urlencoded({extended: true, limit: "50mb"}))
server.use(bodyParser.json({limit: "50mb"}));

server.use("/api", require("./routes"))

const PORT = process.env.PORT || 4000;

sequelize.sync({force: false}).then(() => {
    server.listen(PORT, ( ) => {
        console.log(`Server running on port ${PORT}`);
    })
})

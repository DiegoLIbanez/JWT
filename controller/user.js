const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv")

dotenv.config();

const registroUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        res.status(200).send({message: 'Success'})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const login = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email: email}});
        if(!user) return res.status(404).json({message: "User not found"})

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(404).json({message: "Password incorrect"})

        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: "1h"})
        
        res.status(200).send({token, user})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const mostrarUser = async(req, res ) => {
    try {
        const user = await User.findAll()
        res.status(200).send(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
 
module.exports = { registroUser, mostrarUser, login };
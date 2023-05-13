const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library")
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const  generarIdToken  = require("../helper/generarIdToken");
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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
        user.token = generarIdToken()
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

const googlelogin = async (req, res) => {
    try {
      const { tokenId } = req.body;
      const response = await client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID});
  
      const { email_verified, name, email } = response.payload;
  
      if (email_verified && email) {
        let user = await User.findOne({where: { email }});
  
        if (!user) {
          const password = email + process.env.SECRET_KEY;
        
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(password, salt);

          const newUser = new User({ name, email, password: hashedPassword, createGoogle: true, token: "", cuentaConfirmada: true });
          user = await newUser.save();
        }
  
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        const { _id, name: userName, email: userEmail } = user;
  
        res.json({
          token,
          user: { _id, name: userName, email: userEmail },
        });
      } else {
        return res.status(400).json({ error: "Invalid email" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Something went wrong..." });
    }
  };

 
module.exports = { registroUser, mostrarUser, login, googlelogin };
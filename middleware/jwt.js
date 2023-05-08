const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next ) => {
    try {
        const token = req.header("Authorization");

        if(!token ) {
            return res.status(401).json({message: "Invalid Authentication"});
        }

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
         }

         const varified = jwt.verify(token, process.env.SECRET_KEY);
         req.user = varified;
         next();
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

module.exports = verifyToken;
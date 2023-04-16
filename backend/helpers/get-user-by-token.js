const jwt = require("jsonwebtoken")

const User = require("../models/user")

//get user by jwt token
const getUserByToken = async(token) => {
    if(!token){
        return res.status(401).json({error: "Not allowed"})
    }

    const decodedToken = jwt.verify(token, "nossosecret")
    const userId = decodedToken.id ;
    const user = User.findOne({_id: userId});
    return user;
}

module.exports = getUserByToken
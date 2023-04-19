const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

//middlewares
const verifyToken = require("../helpers/check-token");

//helpers
const getUserByToken = require("../helpers/get-user-by-token");

//get an user
router.get("/:id", verifyToken, async(req, res) => {
    //const user = User.fin
    const id = req.params.id;

    //verify user
    try {
        const user = await User.findOne({_id: id}, {pwd: 0});
        res.json({error: null, user});
    } catch (error) {
        res.status(400).json({error: "User does not exits"});
    }
})

//update an user
router.put("/", verifyToken, async (req, res) => {
    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const userId = user._id.toString();
    const {id, name, pwd, confirmPwd, email} = req.body;

    //check if userid is equal to token user id
    if (userId !== id){
        res.status(401).json({error: "Not allowed"});
    }

    const newData = new User(
        {
            name: name,
            email: email
        });

    //check if passwords match
    if (pwd  != confirmPwd){
        res.status(401).json({error: "Password does not match"});
    }else if (pwd == confirmPwd && pwd != null){
    //create password
        const salt = await bcrypt.genSalt(12);
        const pwdHash = await bcrypt.hash(pwd, salt);
        newData.pwd = pwdHash;    
    }

    try {
        const updatedUser = await User.findOneAndUpdate({_id:id}, {$set: updateData}, {new: true})
        res.json({error: null, msg: "User updated", data: updatedUser});
    } catch (error) {
        res.status(400).json({error: error});
    }
})

module.exports = router;
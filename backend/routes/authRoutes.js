const router = require("express").Router();
const bcrypt = require ("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const User = require("../models/user");

//register an user
router.post("/register", async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const pwd = req.body.pwd;
    const confirmPwd = req.body.confirmPwd;

    //check for required fields
    if(name == null || email == null|| pwd == null || confirmPwd ==null ){
        return res.status(400).json({error : "Please, fill all fields"})
    }

    //check if pww patch
    if (pwd !== confirmPwd){
        return res.status(400).json({error: "Password and confirm password does not match"})
    }

    //check if user exists
    const emailExists = await User.findOne({email: email})
    if (emailExists){
        return res.status(400).json({error: "This email already registered"})
    }

    //create password
    const salt = await bcrypt.genSalt(12);
    const pwdHash = await bcrypt.hash(pwd, salt);

    const newUser = new User(
        {
            name: name,
            email: email,
            pwd: pwdHash
        })

    try {
        const newUser = await user.save()
        //create token
        const token = jwt.sign({
            //payload
            name: newUser.name,
            id: newUser._id
        },
            "nossosecret"
        );
        //return token
        res.json({error:null, msg: "Registered sucessfull", token:  token, userId: newUser._id})
    } catch (error) {
        res.status(400).json({error})
    }
})

router.post("/login", async (req, res) => {
    const {email, pwd} = req.body;
    const user = await User.findOne({email: email})

    //get user
    if (!user){
        res.status(400).json({error: "User does not exist"})
    }

    //check if pwd match
    const checkPwd = await bcrypt.compare(pwd, user.pwd);
    if (!checkPwd){
        res.status(400).json({error: "Invalid password"})
    }

    const newUser = await user.save()
    //create token
    const token = jwt.sign({
        //payload
        name: user.name,
        id: user._id
    },
        "nossosecret"
    );
    //return token
    res.json({error:null, msg: "Login sucessfull", token:  token, userId: user._id})

})

module.exports = router;
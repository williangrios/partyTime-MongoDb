const router = require("express").Router()
const bcrypt = require("bcrypt")

const User = require("../models/user")

//middlewares
const verifyToken = require("../helpers/check-token")

//helpers
const getUserByToken = require("../helpers/get-user-by-token")


//get an user
router.get("/:id", verifyToken, async(req, res) => {
    //const user = User.fin
    const id = req.params.id;

    //verify user
    try {
        const user = await User.findOne({_id: id}, {pwd: 0});
        res.json({error: null, user})
    } catch (error) {
        res.status(400).json({error: "User does not exits"});
    }
})

router.put("/", verifyToken, async (req, res) => {
    const token = req.header("auth-token");

    const user = await getUserByToken(token);
    const userId = user._id.toString();

    const {id, name, pwd, confirmPwd, email} = req.body;

    //check if userid is equal to token user id
    if (userId !== id){
        res.status(401).json({error: "Not allowed"})
    }


    //create password
    const salt = await bcrypt.genSalt(12);
    const pwdHash = await bcrypt.hash(pwd, salt);

    const updateUser = new User(
        {
            name: name,
            email: email,
            pwd: pwdHash
        })
    

    try {
        const user = await User.updateOne({_id:id}, updateUser )
    } catch (error) {
        res.status(400).json({error: error})
    }
})

module.exports = router;
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer")

const Party = require("../models/party");
const User = require("../models/user");

//file storage
const diskStorage = require("../helpers/file-store");
const upload = multer({storage: diskStorage});

//middlewares
const verifyToken = require("../helpers/check-token");

//helpers
const getUserByToken = require("../helpers/get-user-by-token");



//create new party
router.post("/", verifyToken, uploadFields([{name: "photos"}]),  async(req, res) => {
    const  {title, description, party_date: partyDate} = req.body;
    let files = [];
    if (req.files){
        files = req.files.photos;
    }

    //validations
    if(title === null || description === null || partyDate === null){
        return res.status(401).json({error: "Fill all the fields"})
    }

    //verify user
    const token = req.header("auth-token");
    const userByToken = await getUserByToken(token);
    const userId = userByToken._id.toString();
    try {
        const user = await User.findOne({ _id: userId});    
        let photos = [];
        if(files && files.length > 0 ){
            files.forEach((pht, i) => {
                photos[i] = pth.path;
            });
        }

        const party = new Party({
            title: title, 
            description: description, 
            partyDate: partyDate,
            photos: photos,
            privacy: req.body.privacy,
            userId: user._id.toString()
        });

        try {
            const newParty = await party.save();
            res.status(200).json({error: null, msg: "Party created", data: newParty});
        } catch (error) {
            return res.status(400).json({error: error});
        }

    } catch (error) {
        return res.status(400).json({error: "Not allowed"});
    }

})

//routes get all public parties
router.get("/all", async (req, res) => {
    try{
        const allParties = await Party.find({privacy: false}).sort([[id, -1]]);
        return res.json({error: null, data: allParties })
    }catch(error){
        return res.status(400).json({error: error})
    }
});

//user parties
router.get("/userparties", verifyToken, async (req, res) => {
    try {
        const token = req.header("auth-token");
        const userByToken = await getUserByToken(token);
        const userId = userByToken._id.toString();
        const userParties = await Party.find({userId: userId});
        return res.json({error: null, data: userParties});
    } catch (error) {
        return res.status(400).json({error: error});
    }
})

//get party by id
router.get("/userparty/:id", verifyToken, async (req, res) => {
    try {
        const token = req.header("auth-token");
        const userByToken = await getUserByToken(token);
        const userId = userByToken._id.toString();
        const partyId = req.params.id;
        const party = await Party.findOne({userId: userId, _id: partyId});
        return res.json({error: null, data: party})
    } catch (error) {
        return res.status(400).json({error: error});
    }
})

//get party public or private
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const party = await Party.findOne({_id: id});
    } catch (error) {
        return res.status(400).json({error: error});
    }
})

module.exports = router;
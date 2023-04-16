const { Schema, model, default: mongoose} = require("mongoose")

const PartySchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    partyDate: {
        type: Date,
        required: true
    },
    photos: {
        type: Array
    },
    privacy: {
        type: Boolean
    },
    userId:{
        type: mongoose.ObjectId
    }
})

const PartyModel = model(PartySchema)

module.exports = PartyModel
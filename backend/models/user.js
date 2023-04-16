const {Schema, model} = require("mongoose")

//criando o schema
const UserSchema = new Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        required: true,
    },
    pwd:{
        type: String,
        required: true
    }
    //bcrypt vai transformar a senha
    //senhauser
    //paisdufh982 82034ru209r u
})


//criando o model
const UserModel = model("User", UserSchema);

module.exports = UserModel
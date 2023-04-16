const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const cors = require ("cors");

const dbName = "partyTime";
const port = 3000;
const app = express();

//routes
const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")

app.use(cors())
//trabalhar com json na comunicacao
app.use(express.json())
//pasta responsavel pelos arquivos staticos
app.use(express.static("public"))
//rotas de autenticacao
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)


//conexao mongodb
mongoose.connect(`mongodb://localhost/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//atrelar as rotas no express
app.get("/", (req, res) => {
    res.json({ok: true})
})


app.listen(port, () => {
    console.log(`Iniciado na porta ${port}`);
});

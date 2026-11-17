require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const rotas = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", rotas);

app.get("/conexao", async (req, res) => {
    try {
        const conexao = await pool.getConnection();

        conexao.release();

        res.send("Conexão com o banco realizada com sucesso!");
    } catch (erro) {
        console.error(erro);
        res.status(500).send("Erro ao conectar com o banco.");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
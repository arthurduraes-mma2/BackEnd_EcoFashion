const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

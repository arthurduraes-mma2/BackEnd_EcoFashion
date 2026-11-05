const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/clienteController");

router.get("/", (req, res) => {
    res.send("Rota de clientes funcionando!");
});

module.exports = router;
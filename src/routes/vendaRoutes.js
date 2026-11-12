const express = require("express");
const router = express.Router();

const vendaController = require("../controllers/vendaController");

router.post("/", vendaController.finalizarVenda);
router.get("/", vendaController.listarVendas);
router.get("/:id", vendaController.buscarVendaPorId);

module.exports = router;

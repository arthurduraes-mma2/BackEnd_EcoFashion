const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/clienteController");

router.get("/", clienteController.listarClientes);
router.post("/", clienteController.cadastrarCliente);
router.put("/:id", clienteController.atualizarCliente);
router.delete("/:id", clienteController.excluirCliente);

module.exports = router;

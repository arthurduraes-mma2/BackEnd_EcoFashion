const express = require("express");
const router = express.Router();

const consultaController = require("../controllers/consultaController");

router.get("/pedidos", consultaController.listarPedidos);
router.get("/pedidos/:id", consultaController.buscarPedidoPorId);

module.exports = router;

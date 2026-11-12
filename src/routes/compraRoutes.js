const express = require("express");
const router = express.Router();

const compraController = require("../controllers/compraController");

router.post("/", compraController.cadastrarCompra);
router.get("/", compraController.listarCompras);
router.get("/:id", compraController.buscarCompraPorId);

module.exports = router;

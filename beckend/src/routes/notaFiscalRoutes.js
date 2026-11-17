const express = require("express");
const router = express.Router();

const notaFiscalController = require("../controllers/notaFiscalController");

router.post("/", notaFiscalController.emitirNotaFiscal);
router.get("/", notaFiscalController.listarNotasFiscais);
router.get("/:id", notaFiscalController.buscarNotaFiscalPorId);

module.exports = router;

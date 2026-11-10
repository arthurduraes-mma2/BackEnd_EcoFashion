const express = require("express");
const router = express.Router();

const categoriaController = require("../controllers/categoriaControllers");

router.get("/", categoriaController.listarCategorias);
router.get("/:id", categoriaController.buscarCategoria);
router.post("/", categoriaController.cadastrarCategoria);
router.put("/:id", categoriaController.atualizarCategoria);
router.delete("/:id", categoriaController.excluirCategoria);

module.exports = router;
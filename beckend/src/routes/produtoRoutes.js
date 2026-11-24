const express = require("express");
const router = express.Router();

const produtosController = require("../controllers/produtoControllers");

router.get("/", produtosController.listarProdutos);
router.get("/:id", produtosController.buscarProdutos);
router.post("/", produtosController.cadastrarProdutos);
router.put("/:id", produtosController.atualizarProdutos);
router.delete("/:id", produtosController.excluirProdutos);

module.exports = router;
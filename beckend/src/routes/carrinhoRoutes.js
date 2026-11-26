const express = require("express");
const router = express.Router();

const carrinhoController = require("../controllers/carrinhoController");

router.post("/", carrinhoController.criarCarrinho);

router.get("/cliente/:cliente_id", carrinhoController.buscarCarrinhoPorCliente);

router.get("/:id", carrinhoController.buscarCarrinhoPorId);

router.post("/:id/itens", carrinhoController.adicionarProdutos);

router.put("/itens/:id", carrinhoController.atualizarQuantidade);

router.delete("/itens/:id", carrinhoController.removerProdutos);

router.delete("/:id/itens", carrinhoController.limparCarrinho);

module.exports = router;

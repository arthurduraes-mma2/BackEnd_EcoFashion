const express = require("express");
const router = express.Router();

const clienteRoutes = require("./clienteRoutes");
const cadastroRoutes = require("./cadastroRoutes");
const loginRoutes = require("./loginRoutes");
const consultaRoutes = require("./consultaRoutes");
const compraRoutes = require("./compraRoutes");
const vendaRoutes = require("./vendaRoutes");
const notaFiscalRoutes = require("./notaFiscalRoutes");
const carrinhoRoutes = require("./carrinhoRoutes");

const categoriasRoutes = require("./categorias");
const produtoRoutes = require("./produtoRoutes");

router.get("/", (req, res) => {
    res.send("API EcoFashion funcionando!");
});

router.use("/clientes", clienteRoutes);
router.use("/cadastros", cadastroRoutes);
router.use("/login", loginRoutes);
router.use("/consultas", consultaRoutes);
router.use("/compras", compraRoutes);
router.use("/vendas", vendaRoutes);
router.use("/notas-fiscais", notaFiscalRoutes);
router.use("/carrinho", carrinhoRoutes);

router.use("/categorias", categoriasRoutes);
router.use("/produtos", produtoRoutes);

module.exports = router;
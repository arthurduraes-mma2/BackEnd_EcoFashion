
const compraModel = require("../models/compraModel");

async function cadastrarCompra(req, res) {
    try {
        const { cliente_id, itens } = req.body;

        if (!cliente_id || !itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                mensagem: "Cliente e produtos são obrigatórios."
            });
        }

        const pedido_id = await compraModel.cadastrarCompra(cliente_id, itens);

        return res.status(201).json({
            mensagem: "Compra cadastrada com sucesso!",
            pedido_id
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: erro.message
        });
    }
}

async function listarCompras(req, res) {
    try {
        const compras = await compraModel.listarCompras();

        return res.status(200).json(compras);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao listar compras.",
            erro: erro.message
        });
    }
}

async function buscarCompraPorId(req, res) {
    try {
        const { id } = req.params;

        const compra = await compraModel.buscarCompraPorId(id);

        if (compra.length === 0) {
            return res.status(404).json({
                mensagem: "Compra não encontrada."
            });
        }

        return res.status(200).json(compra);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao buscar compra.",
            erro: erro.message
        });
    }
}

module.exports = {
    cadastrarCompra,
    listarCompras,
    buscarCompraPorId
};

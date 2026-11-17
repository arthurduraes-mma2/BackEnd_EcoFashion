const consultaModel = require("../models/consultaModel");

async function listarPedidos(req, res) {
    try {
        const pedidos = await consultaModel.listarPedidos();

        return res.status(200).json(pedidos);

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao consultar os pedidos."
        });
    }
}

async function buscarPedidoPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do pedido inválido."
            });
        }

        const pedido = await consultaModel.buscarPedidoPorId(id);

        if (pedido.length === 0) {
            return res.status(404).json({
                mensagem: "Pedido não encontrado ou sem produtos."
            });
        }

        return res.status(200).json(pedido);

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao consultar o pedido."
        });
    }
}

module.exports = {
    listarPedidos,
    buscarPedidoPorId
};

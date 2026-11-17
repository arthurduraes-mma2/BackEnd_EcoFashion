
const vendaModel = require("../models/vendaModel");

async function finalizarVenda(req, res) {
    try {
        const { pedido_id } = req.body;

        if (!pedido_id) {
            return res.status(400).json({
                mensagem: "O ID do pedido é obrigatório."
            });
        }

        const resultado = await vendaModel.finalizarVenda(pedido_id);

        if (resultado === 0) {
            return res.status(404).json({
                mensagem: "Pedido não encontrado ou já finalizado."
            });
        }

        return res.status(200).json({
            mensagem: "Venda finalizada com sucesso!",
            pedido_id
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao finalizar venda.",
            erro: erro.message
        });
    }
}

async function listarVendas(req, res) {
    try {
        const vendas = await vendaModel.listarVendas();

        return res.status(200).json(vendas);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao listar vendas.",
            erro: erro.message
        });
    }
}

async function buscarVendaPorId(req, res) {
    try {
        const { id } = req.params;

        const venda = await vendaModel.buscarVendaPorId(id);

        if (venda.length === 0) {
            return res.status(404).json({
                mensagem: "Venda não encontrada."
            });
        }

        return res.status(200).json(venda);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao buscar venda.",
            erro: erro.message
        });
    }
}

module.exports = {
    finalizarVenda,
    listarVendas,
    buscarVendaPorId
};

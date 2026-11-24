const compraModel = require("../models/compraModel");

async function cadastrarCompra(req, res) {
    try {
        const { cliente_id, itens } = req.body || {};

        const clienteId = Number(cliente_id);

        if (!Number.isInteger(clienteId) || clienteId <= 0) {
            return res.status(400).json({
                mensagem: "Informe um cliente válido."
            });
        }

        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                mensagem: "Adicione pelo menos um produtos à compra."
            });
        }

        const produtos = [];
        const idsProdutos = new Set();

        for (const item of itens) {
            const produtos_id = Number(item.produtos_id);
            const quantidade = Number(item.quantidade);

            if (
                !Number.isInteger(produtos_id) ||
                produtos_id <= 0 ||
                !Number.isInteger(quantidade) ||
                quantidade <= 0
            ) {
                return res.status(400).json({
                    mensagem: "Informe produtos e quantidades válidos."
                });
            }

            if (idsProdutos.has(produtos_id)) {
                return res.status(400).json({
                    mensagem: "Não repita o mesmo produtos na compra."
                });
            }

            idsProdutos.add(produtos_id);

            produtos.push({
                produtos_id,
                quantidade
            });
        }

        const pedido_id = await compraModel.cadastrarCompra(
            clienteId,
            produtos
        );

        return res.status(201).json({
            mensagem: "Compra cadastrada com sucesso!",
            pedido_id
        });

    } catch (erro) {
        return res.status(erro.statusCode || 500).json({
            mensagem: erro.message || "Erro ao cadastrar compra."
        });
    }
}

async function listarCompras(req, res) {
    try {
        const compras = await compraModel.listarCompras();

        return res.status(200).json(compras);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao listar compras."
        });
    }
}

async function buscarCompraPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "Informe um ID de compra válido."
            });
        }

        const compra = await compraModel.buscarCompraPorId(id);

        if (compra.length === 0) {
            return res.status(404).json({
                mensagem: "Compra não encontrada."
            });
        }

        return res.status(200).json(compra);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao buscar compra."
        });
    }
}

module.exports = {
    cadastrarCompra,
    listarCompras,
    buscarCompraPorId
};

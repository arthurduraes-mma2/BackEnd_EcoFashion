
const carrinhoModel = require("../models/carrinhoModel");

async function criarCarrinho(req, res) {
    try {
        const { cliente_id } = req.body;

        if (!cliente_id) {
            return res.status(400).json({
                mensagem: "O ID do cliente é obrigatório."
            });
        }

        const id = await carrinhoModel.criarCarrinho(cliente_id);

        res.status(201).json({
            mensagem: "Carrinho criado com sucesso!",
            carrinho_id: id
        });

    } catch (erro) {
        res.status(400).json({ mensagem: erro.message });
    }
}

async function buscarCarrinhoPorCliente(req, res) {
    try {
        const { cliente_id } = req.params;

        const carrinho = await carrinhoModel.buscarCarrinhoPorCliente(cliente_id);

        if (carrinho.length === 0) {
            return res.status(404).json({
                mensagem: "Carrinho ativo não encontrado para este cliente."
            });
        }

        res.json(carrinho);

    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
}

async function buscarCarrinhoPorId(req, res) {
    try {
        const { id } = req.params;

        const carrinho = await carrinhoModel.buscarCarrinhoPorId(id);

        if (carrinho.length === 0) {
            return res.status(404).json({
                mensagem: "Carrinho não encontrado."
            });
        }

        res.json(carrinho);

    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
}

async function adicionarProduto(req, res) {
    try {
        const { id } = req.params;
        const { produto_id, quantidade } = req.body;

        if (!produto_id || !Number.isInteger(quantidade) || quantidade <= 0) {
            return res.status(400).json({
                mensagem: "Informe um produto e uma quantidade válida."
            });
        }

        const resultado = await carrinhoModel.adicionarProduto(
            id,
            produto_id,
            quantidade
        );

        res.json(resultado);

    } catch (erro) {
        res.status(400).json({ mensagem: erro.message });
    }
}

async function atualizarQuantidade(req, res) {
    try {
        const { id } = req.params;
        const { quantidade } = req.body;

        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return res.status(400).json({
                mensagem: "Informe uma quantidade válida."
            });
        }

        const resultado = await carrinhoModel.atualizarQuantidade(
            id,
            quantidade
        );

        res.json(resultado);

    } catch (erro) {
        res.status(400).json({ mensagem: erro.message });
    }
}

async function removerProduto(req, res) {
    try {
        const { id } = req.params;

        const resultado = await carrinhoModel.removerProduto(id);

        if (resultado === 0) {
            return res.status(404).json({
                mensagem: "Item não encontrado no carrinho."
            });
        }

        res.json({
            mensagem: "Produto removido do carrinho com sucesso!"
        });

    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
}

async function limparCarrinho(req, res) {
    try {
        const { id } = req.params;

        await carrinhoModel.limparCarrinho(id);

        res.json({
            mensagem: "Carrinho esvaziado com sucesso!"
        });

    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
}

module.exports = {
    criarCarrinho,
    buscarCarrinhoPorCliente,
    buscarCarrinhoPorId,
    adicionarProduto,
    atualizarQuantidade,
    removerProduto,
    limparCarrinho
};

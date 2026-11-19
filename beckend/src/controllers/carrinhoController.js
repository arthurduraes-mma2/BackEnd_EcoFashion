const carrinhoModel = require("../models/carrinhoModel");

async function criarCarrinho(req, res) {
    try {
        const { cliente_id } = req.body;

        if (!Number.isInteger(cliente_id) || cliente_id <= 0) {
            return res.status(400).json({
                mensagem: "Informe um ID de cliente válido."
            });
        }

        const id = await carrinhoModel.criarCarrinho(cliente_id);

        return res.status(201).json({
            mensagem: "Carrinho criado com sucesso!",
            carrinho_id: id
        });

    } catch (erro) {
        console.error(erro);

        return res.status(erro.statusCode || 500).json({
            mensagem: erro.message || "Erro ao criar carrinho."
        });
    }
}

async function buscarCarrinhoPorCliente(req, res) {
    try {
        const cliente_id = Number(req.params.cliente_id);

        if (!Number.isInteger(cliente_id) || cliente_id <= 0) {
            return res.status(400).json({
                mensagem: "ID do cliente inválido."
            });
        }

        const carrinho = await carrinhoModel.buscarCarrinhoPorCliente(cliente_id);

        if (carrinho.length === 0) {
            return res.status(404).json({
                mensagem: "Carrinho ativo não encontrado para este cliente."
            });
        }

        return res.status(200).json(carrinho);

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar carrinho."
        });
    }
}

async function buscarCarrinhoPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do carrinho inválido."
            });
        }

        const carrinho = await carrinhoModel.buscarCarrinhoPorId(id);

        if (carrinho.length === 0) {
            return res.status(404).json({
                mensagem: "Carrinho não encontrado."
            });
        }

        return res.status(200).json(carrinho);

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar carrinho."
        });
    }
}

async function adicionarProduto(req, res) {
    try {
        const id = Number(req.params.id);
        const { produto_id, quantidade } = req.body;

        if (
            !Number.isInteger(id) || id <= 0 ||
            !Number.isInteger(produto_id) || produto_id <= 0 ||
            !Number.isInteger(quantidade) || quantidade <= 0
        ) {
            return res.status(400).json({
                mensagem: "Informe IDs válidos e uma quantidade maior que zero."
            });
        }

        const resultado = await carrinhoModel.adicionarProduto(
            id,
            produto_id,
            quantidade
        );

        return res.status(200).json(resultado);

    } catch (erro) {
        console.error(erro);

        return res.status(erro.statusCode || 500).json({
            mensagem: erro.message || "Erro ao adicionar produto ao carrinho."
        });
    }
}

async function atualizarQuantidade(req, res) {
    try {
        const id = Number(req.params.id);
        const { quantidade } = req.body;

        if (
            !Number.isInteger(id) || id <= 0 ||
            !Number.isInteger(quantidade) || quantidade <= 0
        ) {
            return res.status(400).json({
                mensagem: "Informe um ID válido e uma quantidade maior que zero."
            });
        }

        const resultado = await carrinhoModel.atualizarQuantidade(
            id,
            quantidade
        );

        return res.status(200).json(resultado);

    } catch (erro) {
        console.error(erro);

        return res.status(erro.statusCode || 500).json({
            mensagem: erro.message || "Erro ao atualizar quantidade."
        });
    }
}

async function removerProduto(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do item inválido."
            });
        }

        const resultado = await carrinhoModel.removerProduto(id);

        if (resultado === 0) {
            return res.status(404).json({
                mensagem: "Item não encontrado no carrinho ativo."
            });
        }

        return res.status(200).json({
            mensagem: "Produto removido do carrinho com sucesso!"
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao remover produto do carrinho."
        });
    }
}

async function limparCarrinho(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do carrinho inválido."
            });
        }

        await carrinhoModel.limparCarrinho(id);

        return res.status(200).json({
            mensagem: "Carrinho esvaziado com sucesso!"
        });

    } catch (erro) {
        console.error(erro);

        return res.status(erro.statusCode || 500).json({
            mensagem: erro.message || "Erro ao esvaziar carrinho."
        });
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

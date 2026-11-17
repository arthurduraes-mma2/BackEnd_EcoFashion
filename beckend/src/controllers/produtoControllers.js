const produtoModel = require("../models/produtoModel");

async function listarProdutos(req, res) {
    try {
        const produtos = await produtoModel.listarProdutos();

        res.json(produtos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao listar produtos."
        });
    }
}

async function buscarProduto(req, res) {
    try {
        const { id } = req.params;

        const resultado = await produtoModel.buscarProduto(id);

        if (resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        res.json(resultado[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao buscar produto."
        });
    }
}

async function cadastrarProduto(req, res) {
    try {
        const {
            nome,
            preco,
            estoque,
            descricao,
            tamanho,
            cor,
            imagem,
            material,
            categoria_id
        } = req.body;

        if (
            !nome ||
            preco === undefined ||
            estoque === undefined ||
            !categoria_id
        ) {
            return res.status(400).json({
                mensagem: "Nome, preço, estoque e categoria são obrigatórios."
            });
        }

        if (
            !Number.isFinite(Number(preco)) ||
            Number(preco) < 0 ||
            !Number.isInteger(Number(estoque)) ||
            Number(estoque) < 0
        ) {
            return res.status(400).json({
                mensagem: "Preço ou estoque inválido."
            });
        }

        await produtoModel.cadastrarProduto(
            nome,
            preco,
            estoque,
            descricao,
            tamanho,
            cor,
            imagem,
            material,
            categoria_id
        );

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!"
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao cadastrar produto. Verifique a categoria informada."
        });
    }
}

async function atualizarProduto(req, res) {
    try {
        const { id } = req.params;

        const {
            nome,
            preco,
            estoque,
            descricao,
            tamanho,
            cor,
            imagem,
            material,
            categoria_id
        } = req.body;

        if (
            !nome ||
            preco === undefined ||
            estoque === undefined ||
            !categoria_id
        ) {
            return res.status(400).json({
                mensagem: "Nome, preço, estoque e categoria são obrigatórios."
            });
        }

        if (
            !Number.isFinite(Number(preco)) ||
            Number(preco) < 0 ||
            !Number.isInteger(Number(estoque)) ||
            Number(estoque) < 0
        ) {
            return res.status(400).json({
                mensagem: "Preço ou estoque inválido."
            });
        }

        const produto = await produtoModel.buscarProduto(id);

        if (produto.length === 0) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        await produtoModel.atualizarProduto(
            id,
            nome,
            preco,
            estoque,
            descricao,
            tamanho,
            cor,
            imagem,
            material,
            categoria_id
        );

        res.json({
            mensagem: "Produto atualizado com sucesso!"
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao atualizar produto. Verifique a categoria informada."
        });
    }
}

async function excluirProduto(req, res) {
    try {
        const { id } = req.params;

        const produto = await produtoModel.buscarProduto(id);

        if (produto.length === 0) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        await produtoModel.excluirProduto(id);

        res.json({
            mensagem: "Produto excluído com sucesso!"
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao excluir produto."
        });
    }
}

module.exports = {
    listarProdutos,
    buscarProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
};
const produtoModel = require("../models/produtoModel");

async function listarProdutos(req, res) {
    try {
        const produtos = await produtoModel.listarProdutos();

        return res.status(200).json(produtos);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao listar produtos."
        });
    }
}

async function buscarProduto(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do produto inválido."
            });
        }

        const resultado = await produtoModel.buscarProduto(id);

        if (resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        return res.status(200).json(resultado[0]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
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
            typeof nome !== "string" ||
            !nome.trim() ||
            preco === undefined ||
            preco === null ||
            preco === "" ||
            estoque === undefined ||
            estoque === null ||
            estoque === "" ||
            categoria_id === undefined ||
            categoria_id === null ||
            categoria_id === ""
        ) {
            return res.status(400).json({
                mensagem: "Nome, preço, estoque e categoria são obrigatórios."
            });
        }

        if (nome.trim().length > 100) {
            return res.status(400).json({
                mensagem: "O nome deve ter no máximo 100 caracteres."
            });
        }

        if (
            !Number.isFinite(Number(preco)) ||
            Number(preco) < 0 ||
            Number(preco) > 99999999.99 ||
            !Number.isInteger(Number(estoque)) ||
            Number(estoque) < 0 ||
            !Number.isInteger(Number(categoria_id)) ||
            Number(categoria_id) <= 0
        ) {
            return res.status(400).json({
                mensagem: "Preço, estoque ou categoria inválidos."
            });
        }

        if (
            (descricao !== undefined && descricao !== null && typeof descricao !== "string") ||
            (tamanho !== undefined && tamanho !== null && typeof tamanho !== "string") ||
            (cor !== undefined && cor !== null && typeof cor !== "string") ||
            (imagem !== undefined && imagem !== null && typeof imagem !== "string") ||
            (material !== undefined && material !== null && typeof material !== "string")
        ) {
            return res.status(400).json({
                mensagem: "Os campos de descrição, tamanho, cor, imagem e material devem ser textos."
            });
        }

        if (
            (tamanho && tamanho.length > 10) ||
            (cor && cor.length > 30) ||
            (imagem && imagem.length > 500) ||
            (material && material.length > 100)
        ) {
            return res.status(400).json({
                mensagem: "Um ou mais campos ultrapassaram o limite de caracteres."
            });
        }

        await produtoModel.cadastrarProduto(
            nome.trim(),
            Number(preco),
            Number(estoque),
            descricao || null,
            tamanho || null,
            cor || null,
            imagem || null,
            material || null,
            Number(categoria_id)
        );

        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!"
        });
    } catch (erro) {
        console.error(erro);

        if (erro.code === "ER_NO_REFERENCED_ROW_2" || erro.errno === 1452) {
            return res.status(400).json({
                mensagem: "A categoria informada não existe."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao cadastrar produto."
        });
    }
}

async function atualizarProduto(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do produto inválido."
            });
        }

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
            typeof nome !== "string" ||
            !nome.trim() ||
            preco === undefined ||
            preco === null ||
            preco === "" ||
            estoque === undefined ||
            estoque === null ||
            estoque === "" ||
            categoria_id === undefined ||
            categoria_id === null ||
            categoria_id === ""
        ) {
            return res.status(400).json({
                mensagem: "Nome, preço, estoque e categoria são obrigatórios."
            });
        }

        if (nome.trim().length > 100) {
            return res.status(400).json({
                mensagem: "O nome deve ter no máximo 100 caracteres."
            });
        }

        if (
            !Number.isFinite(Number(preco)) ||
            Number(preco) < 0 ||
            Number(preco) > 99999999.99 ||
            !Number.isInteger(Number(estoque)) ||
            Number(estoque) < 0 ||
            !Number.isInteger(Number(categoria_id)) ||
            Number(categoria_id) <= 0
        ) {
            return res.status(400).json({
                mensagem: "Preço, estoque ou categoria inválidos."
            });
        }

        if (
            (descricao !== undefined && descricao !== null && typeof descricao !== "string") ||
            (tamanho !== undefined && tamanho !== null && typeof tamanho !== "string") ||
            (cor !== undefined && cor !== null && typeof cor !== "string") ||
            (imagem !== undefined && imagem !== null && typeof imagem !== "string") ||
            (material !== undefined && material !== null && typeof material !== "string")
        ) {
            return res.status(400).json({
                mensagem: "Os campos de descrição, tamanho, cor, imagem e material devem ser textos."
            });
        }

        if (
            (tamanho && tamanho.length > 10) ||
            (cor && cor.length > 30) ||
            (imagem && imagem.length > 500) ||
            (material && material.length > 100)
        ) {
            return res.status(400).json({
                mensagem: "Um ou mais campos ultrapassaram o limite de caracteres."
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
            nome.trim(),
            Number(preco),
            Number(estoque),
            descricao || null,
            tamanho || null,
            cor || null,
            imagem || null,
            material || null,
            Number(categoria_id)
        );

        return res.status(200).json({
            mensagem: "Produto atualizado com sucesso!"
        });
    } catch (erro) {
        console.error(erro);

        if (erro.code === "ER_NO_REFERENCED_ROW_2" || erro.errno === 1452) {
            return res.status(400).json({
                mensagem: "A categoria informada não existe."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao atualizar produto."
        });
    }
}

async function excluirProduto(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do produto inválido."
            });
        }

        const produto = await produtoModel.buscarProduto(id);

        if (produto.length === 0) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        await produtoModel.excluirProduto(id);

        return res.status(200).json({
            mensagem: "Produto excluído com sucesso!"
        });
    } catch (erro) {
        console.error(erro);

        if (erro.code === "ER_ROW_IS_REFERENCED_2" || erro.errno === 1451) {
            return res.status(409).json({
                mensagem: "Não é possível excluir este produto porque ele está vinculado a um carrinho ou pedido."
            });
        }

        return res.status(500).json({
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

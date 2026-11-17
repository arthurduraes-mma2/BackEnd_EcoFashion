const categoriasModel = require("../models/categoriasModel");

async function listarCategorias(req, res) {
    try {
        const categorias = await categoriasModel.listarCategorias();

        res.json(categorias);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao listar categorias."
        });
    }
}

async function buscarCategoria(req, res) {
    try {
        const { id } = req.params;
        const resultado = await categoriasModel.buscarCategoria(id);

        if (resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada."
            });
        }

        res.json(resultado[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao buscar categoria."
        });
    }
}

async function cadastrarCategoria(req, res) {
    try {
        const { nome, descricao } = req.body;

        if (!nome) {
            return res.status(400).json({
                mensagem: "O nome da categoria é obrigatório."
            });
        }

        await categoriasModel.cadastrarCategoria(nome, descricao);

        res.status(201).json({
            mensagem: "Categoria cadastrada com sucesso!"
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao cadastrar categoria."
        });
    }
}

async function atualizarCategoria(req, res) {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        if (!nome) {
            return res.status(400).json({
                mensagem: "O nome da categoria é obrigatório."
            });
        }

        const categoria = await categoriasModel.buscarCategoria(id);

        if (categoria.length === 0) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada."
            });
        }

        await categoriasModel.atualizarCategoria(id, nome, descricao);

        res.json({
            mensagem: "Categoria atualizada com sucesso!"
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao atualizar categoria."
        });
    }
}

async function excluirCategoria(req, res) {
    try {
        const { id } = req.params;

        const categoria = await categoriasModel.buscarCategoria(id);

        if (categoria.length === 0) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada."
            });
        }

        await categoriasModel.excluirCategoria(id);

        res.json({
            mensagem: "Categoria excluída com sucesso!"
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao excluir categoria. Verifique se existem produtos vinculados."
        });
    }
}

module.exports = {
    listarCategorias,
    buscarCategoria,
    cadastrarCategoria,
    atualizarCategoria,
    excluirCategoria
};
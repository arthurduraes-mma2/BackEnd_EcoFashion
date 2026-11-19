const categoriasModel = require("../models/categoriasModel");

async function listarCategorias(req, res) {
    try {
        const categorias = await categoriasModel.listarCategorias();

        return res.status(200).json(categorias);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao listar categorias."
        });
    }
}

async function buscarCategoria(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID da categoria inválido."
            });
        }

        const categoria = await categoriasModel.buscarCategoria(id);

        if (categoria.length === 0) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada."
            });
        }

        return res.status(200).json(categoria[0]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao buscar categoria."
        });
    }
}

async function cadastrarCategoria(req, res) {
    try {
        const { nome, descricao } = req.body;

        if (!nome || typeof nome !== "string" || !nome.trim()) {
            return res.status(400).json({
                mensagem: "O nome da categoria é obrigatório."
            });
        }

        if (nome.trim().length > 100) {
            return res.status(400).json({
                mensagem: "O nome deve ter no máximo 100 caracteres."
            });
        }

        if (descricao !== undefined && descricao !== null && typeof descricao !== "string") {
            return res.status(400).json({
                mensagem: "A descrição deve ser um texto."
            });
        }

        await categoriasModel.cadastrarCategoria(
            nome.trim(),
            descricao ? descricao.trim() : null
        );

        return res.status(201).json({
            mensagem: "Categoria cadastrada com sucesso!"
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar categoria."
        });
    }
}

async function atualizarCategoria(req, res) {
    try {
        const id = Number(req.params.id);
        const { nome, descricao } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID da categoria inválido."
            });
        }

        if (!nome || typeof nome !== "string" || !nome.trim()) {
            return res.status(400).json({
                mensagem: "O nome da categoria é obrigatório."
            });
        }

        if (nome.trim().length > 100) {
            return res.status(400).json({
                mensagem: "O nome deve ter no máximo 100 caracteres."
            });
        }

        if (descricao !== undefined && descricao !== null && typeof descricao !== "string") {
            return res.status(400).json({
                mensagem: "A descrição deve ser um texto."
            });
        }

        const categoria = await categoriasModel.buscarCategoria(id);

        if (categoria.length === 0) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada."
            });
        }

        await categoriasModel.atualizarCategoria(
            id,
            nome.trim(),
            descricao ? descricao.trim() : null
        );

        return res.status(200).json({
            mensagem: "Categoria atualizada com sucesso!"
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao atualizar categoria."
        });
    }
}

async function excluirCategoria(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID da categoria inválido."
            });
        }

        const categoria = await categoriasModel.buscarCategoria(id);

        if (categoria.length === 0) {
            return res.status(404).json({
                mensagem: "Categoria não encontrada."
            });
        }

        await categoriasModel.excluirCategoria(id);

        return res.status(200).json({
            mensagem: "Categoria excluída com sucesso!"
        });
    } catch (erro) {
        console.error(erro);

        if (erro.code === "ER_ROW_IS_REFERENCED_2" || erro.errno === 1451) {
            return res.status(409).json({
                mensagem: "Não é possível excluir esta categoria porque existem produtos vinculados a ela."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao excluir categoria."
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

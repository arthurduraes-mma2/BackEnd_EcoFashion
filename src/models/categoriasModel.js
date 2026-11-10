
const pool = require("../config/db");

async function listarCategorias() {
    return await pool.query("SELECT * FROM categorias");
}

async function buscarCategoria(id) {
    return await pool.query(
        "SELECT * FROM categorias WHERE id = ?",
        [id]
    );
}

async function cadastrarCategoria(nome, descricao) {
    return await pool.query(
        "INSERT INTO categorias (nome, descricao) VALUES (?, ?)",
        [nome, descricao]
    );
}

async function atualizarCategoria(id, nome, descricao) {
    return await pool.query(
        "UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?",
        [nome, descricao, id]
    );
}

async function excluirCategoria(id) {
    return await pool.query(
        "DELETE FROM categorias WHERE id = ?",
        [id]
    );
}

module.exports = {
    listarCategorias,
    buscarCategoria,
    cadastrarCategoria,
    atualizarCategoria,
    excluirCategoria
};

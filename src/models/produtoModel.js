
const pool = require("../config/db");

async function listarProdutos() {
    return await pool.query("SELECT * FROM produto");
}

async function buscarProduto(id) {
    return await pool.query(
        "SELECT * FROM produto WHERE id = ?",
        [id]
    );
}

async function cadastrarProduto(nome, preco, estoque, descricao, tamanho, cor, imagem, material, categoria_id) {
    return await pool.query(
        `INSERT INTO produto
        (nome, preco, estoque, descricao, tamanho, cor, imagem, material, categoria_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, preco, estoque, descricao, tamanho, cor, imagem, material, categoria_id]
    );
}

async function atualizarProduto(id, nome, preco, estoque, descricao, tamanho, cor, imagem, material, categoria_id) {
    return await pool.query(
        `UPDATE produto SET
        nome = ?, preco = ?, estoque = ?, descricao = ?,
        tamanho = ?, cor = ?, imagem = ?, material = ?,
        categoria_id = ?
        WHERE id = ?`,
        [nome, preco, estoque, descricao, tamanho, cor, imagem, material, categoria_id, id]
    );
}

async function excluirProduto(id) {
    return await pool.query(
        "DELETE FROM produto WHERE id = ?",
        [id]
    );
}

module.exports = {
    listarProdutos,
    buscarProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
};

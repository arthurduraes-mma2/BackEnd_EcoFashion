const pool = require("../config/db");

async function listarProdutos() {
    return await pool.query(
        "SELECT * FROM produtos ORDER BY id"
    );
}

async function buscarProdutos(id) {
    return await pool.query(
        "SELECT * FROM produtos WHERE id = ?",
        [id]
    );
}

async function cadastrarProdutos(
    nome,
    preco,
    estoque,
    descricao,
    tamanho,
    cor,
    imagem,
    material,
    categoria_id
) {
    return await pool.query(
        `INSERT INTO produtos
        (nome, preco, estoque, descricao, tamanho, cor, imagem, material, categoria_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, preco, estoque, descricao, tamanho, cor, imagem, material, categoria_id]
    );
}

async function atualizarProdutos(
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
) {
    return await pool.query(
        `UPDATE produtos SET
        nome = ?, preco = ?, estoque = ?, descricao = ?,
        tamanho = ?, cor = ?, imagem = ?, material = ?,
        categoria_id = ?
        WHERE id = ?`,
        [nome, preco, estoque, descricao, tamanho, cor, imagem, material, categoria_id, id]
    );
}

async function excluirProdutos(id) {
    return await pool.query(
        "DELETE FROM produtos WHERE id = ?",
        [id]
    );
}

module.exports = {
    listarProdutos,
    buscarProdutos,
    cadastrarProdutos,
    atualizarProdutos,
    excluirProdutos
};
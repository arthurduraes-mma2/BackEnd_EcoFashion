const pool = require("../config/db");

async function listarClientes() {
    const conexao = await pool.getConnection();

    try {
        const resultado = await conexao.query(
            "SELECT * FROM clientes"
        );

        return resultado;
    } finally {
        conexao.release();
    }
}

async function cadastrarCliente(nome, email, senha, cpf, telefone, endereco) {
    const conexao = await pool.getConnection();

    try {
        const resultado = await conexao.query(
            `INSERT INTO clientes 
            (nome, email, senha, cpf, telefone, endereco)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, email, senha, cpf, telefone, endereco]
        );

        return resultado;
    } finally {
        conexao.release();
    }
}

async function atualizarCliente(id, nome, email, cpf, telefone, endereco) {
    const conexao = await pool.getConnection();

    try {
        const resultado = await conexao.query(
            `UPDATE clientes
            SET nome = ?, email = ?, cpf = ?, telefone = ?, endereco = ?
            WHERE id = ?`,
            [nome, email, cpf, telefone, endereco, id]
        );

        return resultado;
    } finally {
        conexao.release();
    }
}

async function excluirCliente(id) {
    const conexao = await pool.getConnection();

    try {
        const resultado = await conexao.query(
            "DELETE FROM clientes WHERE id = ?",
            [id]
        );

        return resultado;
    } finally {
        conexao.release();
    }
}

module.exports = {
    listarClientes,
    cadastrarCliente,
    atualizarCliente,
    excluirCliente
};

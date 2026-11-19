const pool = require("../config/db");

async function listarClientes() {
    const conexao = await pool.getConnection();

    try {
        const resultado = await conexao.query(
            `SELECT id, nome, email, cpf, telefone, endereco
             FROM clientes`
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

        const clientes = await conexao.query(
            "SELECT id FROM clientes WHERE id = ?",
            [id]
        );

        return {
            affectedRows: resultado.affectedRows,
            clienteExiste: clientes.length > 0
        };
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
    atualizarCliente,
    excluirCliente
};

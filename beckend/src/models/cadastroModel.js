const pool = require("../config/db");

async function cadastrar(nome, email, senha, cpf, telefone, endereco) {
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

module.exports = {
    cadastrar
};

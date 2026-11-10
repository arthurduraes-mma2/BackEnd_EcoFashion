const pool = require("../config/db");

async function buscarClientePorEmail(email) {
    const conexao = await pool.getConnection();

    try {
        const resultado = await conexao.query(
            "SELECT * FROM clientes WHERE email = ?",
            [email]
        );

        return resultado[0];
    } finally {
        conexao.release();
    }
}

module.exports = {
    buscarClientePorEmail
};
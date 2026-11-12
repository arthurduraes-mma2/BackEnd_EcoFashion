const pool = require("../config/db");

async function emitirNotaFiscal(pedido_id) {
    const conexao = await pool.getConnection();

    try {
        const pedidos = await conexao.query(
            `SELECT id, valor_total, STATUS
             FROM pedidos
             WHERE id = ?`,
            [pedido_id]
        );

        if (pedidos.length === 0) {
            throw new Error("Pedido não encontrado.");
        }

        const pedido = pedidos[0];

        if (pedido.STATUS !== "Concluído") {
            throw new Error("Não é possível emitir nota fiscal para um pedido não finalizado.");
        }

        const notasExistentes = await conexao.query(
            `SELECT id FROM notas_fiscais
             WHERE pedido_id = ?`,
            [pedido_id]
        );

        if (notasExistentes.length > 0) {
            throw new Error("Esse pedido já possui uma nota fiscal.");
        }

        const numero = String(Date.now());
        const serie = "1";

        const resultado = await conexao.query(
            `INSERT INTO notas_fiscais
            (numero, serie, DATA_emissao, valor_total, pedido_id)
            VALUES (?, ?, NOW(), ?, ?)`,
            [numero, serie, pedido.valor_total, pedido_id]
        );

        return Number(resultado.insertId);

    } finally {
        conexao.release();
    }
}

async function listarNotasFiscais() {
    return await pool.query(
        `SELECT * FROM notas_fiscais
         ORDER BY id DESC`
    );
}

async function buscarNotaFiscalPorId(id) {
    return await pool.query(
        `SELECT * FROM notas_fiscais
         WHERE id = ?`,
        [id]
    );
}

module.exports = {
    emitirNotaFiscal,
    listarNotasFiscais,
    buscarNotaFiscalPorId
};

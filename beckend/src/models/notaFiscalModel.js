const pool = require("../config/db");

function criarErro(mensagem, statusCode = 400) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

async function emitirNotaFiscal(pedido_id) {
    const conexao = await pool.getConnection();
    let transacaoIniciada = false;

    try {
        await conexao.beginTransaction();
        transacaoIniciada = true;

        // Verifica se o pedido existe e bloqueia sua linha.
        const pedidos = await conexao.query(
            `SELECT id, valor_total, STATUS
             FROM pedidos
             WHERE id = ?
             FOR UPDATE`,
            [pedido_id]
        );

        if (pedidos.length === 0) {
            throw criarErro("Pedido não encontrado.", 404);
        }

        const pedido = pedidos[0];

        if (pedido.STATUS !== "Concluído") {
            throw criarErro(
                "Não é possível emitir nota fiscal para um pedido não finalizado.",
                400
            );
        }

        // Verifica se já existe uma nota para esse pedido.
        const notasExistentes = await conexao.query(
            `SELECT id
             FROM notas_fiscais
             WHERE pedido_id = ?`,
            [pedido_id]
        );

        if (notasExistentes.length > 0) {
            throw criarErro(
                "Esse pedido já possui uma nota fiscal.",
                409
            );
        }

        const numero = String(Date.now());
        const serie = "1";

        const resultado = await conexao.query(
            `INSERT INTO notas_fiscais
             (numero, serie, DATA_emissao, valor_total, pedido_id)
             VALUES (?, ?, NOW(), ?, ?)`,
            [
                numero,
                serie,
                pedido.valor_total,
                pedido_id
            ]
        );

        const nota_id = Number(resultado.insertId);

        await conexao.commit();
        transacaoIniciada = false;

        return nota_id;

    } catch (erro) {
        if (transacaoIniciada) {
            await conexao.rollback();
        }

        if (erro.code === "ER_DUP_ENTRY") {
            throw criarErro(
                "Esse pedido já possui uma nota fiscal.",
                409
            );
        }

        throw erro;

    } finally {
        conexao.release();
    }
}

async function listarNotasFiscais() {
    return await pool.query(
        `SELECT
            notas_fiscais.id,
            notas_fiscais.numero,
            notas_fiscais.serie,
            notas_fiscais.DATA_emissao,
            notas_fiscais.valor_total,
            notas_fiscais.pedido_id
         FROM notas_fiscais
         ORDER BY notas_fiscais.id DESC`
    );
}

async function buscarNotaFiscalPorId(id) {
    return await pool.query(
        `SELECT
            notas_fiscais.id,
            notas_fiscais.numero,
            notas_fiscais.serie,
            notas_fiscais.DATA_emissao,
            notas_fiscais.valor_total,
            notas_fiscais.pedido_id
         FROM notas_fiscais
         WHERE notas_fiscais.id = ?`,
        [id]
    );
}

module.exports = {
    emitirNotaFiscal,
    listarNotasFiscais,
    buscarNotaFiscalPorId
};

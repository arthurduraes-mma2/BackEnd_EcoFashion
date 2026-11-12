const pool = require("../config/db");

async function finalizarVenda(pedido_id) {
    const resultado = await pool.query(
        `UPDATE pedidos
         SET STATUS = 'Concluído'
         WHERE id = ? AND STATUS = 'Pendente'`,
        [pedido_id]
    );

    return resultado.affectedRows;
}

async function listarVendas() {
    return await pool.query(
        `SELECT * FROM pedidos
         WHERE STATUS = 'Concluído'
         ORDER BY id DESC`
    );
}

async function buscarVendaPorId(id) {
    return await pool.query(
        `SELECT
            pedidos.id,
            pedidos.data_pedido,
            pedidos.valor_total,
            pedidos.STATUS,
            pedidos.cliente_id,
            itens_pedido.id AS item_id,
            itens_pedido.produto_id,
            itens_pedido.quantidade,
            itens_pedido.preco_unitario
         FROM pedidos
         LEFT JOIN itens_pedido
         ON pedidos.id = itens_pedido.pedido_id
         WHERE pedidos.id = ?
         AND pedidos.STATUS = 'Concluído'`,
        [id]
    );
}

module.exports = {
    finalizarVenda,
    listarVendas,
    buscarVendaPorId
};

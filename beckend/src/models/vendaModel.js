const pool = require("../config/db");

async function finalizarVenda(pedido_id) {
    const resultado = await pool.query(
        `UPDATE pedidos
         SET STATUS = 'Concluído'
         WHERE id = ?
         AND STATUS = 'Pendente'`,
        [pedido_id]
    );

    return resultado.affectedRows;
}

async function listarVendas() {
    return await pool.query(
        `SELECT
            pedidos.id,
            pedidos.data_pedido,
            pedidos.valor_total,
            pedidos.STATUS,
            pedidos.cliente_id,
            clientes.nome AS cliente_nome
         FROM pedidos
         INNER JOIN clientes
            ON pedidos.cliente_id = clientes.id
         WHERE pedidos.STATUS = 'Concluído'
         ORDER BY pedidos.id DESC`
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
            clientes.nome AS cliente_nome,
            itens_pedido.id AS item_id,
            itens_pedido.produtos_id,
            produtos.nome AS produtos_nome,
            itens_pedido.quantidade,
            itens_pedido.preco_unitario
         FROM pedidos
         INNER JOIN clientes
            ON pedidos.cliente_id = clientes.id
         LEFT JOIN itens_pedido
            ON pedidos.id = itens_pedido.pedido_id
         LEFT JOIN produtos
            ON itens_pedido.produtos_id = produtos.id
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

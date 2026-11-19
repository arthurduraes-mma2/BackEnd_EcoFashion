const pool = require("../config/db");

async function listarPedidos() {
    const resultado = await pool.query(`
        SELECT
            pedidos.id,
            pedidos.data_pedido,
            pedidos.valor_total,
            pedidos.STATUS AS status,
            clientes.id AS cliente_id,
            clientes.nome AS cliente_nome,
            clientes.email AS cliente_email
        FROM pedidos
        INNER JOIN clientes
            ON pedidos.cliente_id = clientes.id
        ORDER BY pedidos.id DESC
    `);

    return resultado;
}

async function buscarPedidoPorId(id) {
    const resultado = await pool.query(`
        SELECT
            pedidos.id AS pedido_id,
            pedidos.data_pedido,
            pedidos.valor_total,
            pedidos.STATUS AS status,
            clientes.id AS cliente_id,
            clientes.nome AS cliente_nome,
            produto.id AS produto_id,
            produto.nome AS produto_nome,
            itens_pedido.id AS item_id,
            itens_pedido.quantidade,
            itens_pedido.preco_unitario
        FROM pedidos
        INNER JOIN clientes
            ON pedidos.cliente_id = clientes.id
        LEFT JOIN itens_pedido
            ON pedidos.id = itens_pedido.pedido_id
        LEFT JOIN produto
            ON itens_pedido.produto_id = produto.id
        WHERE pedidos.id = ?
    `, [id]);

    return resultado;
}

module.exports = {
    listarPedidos,
    buscarPedidoPorId
};

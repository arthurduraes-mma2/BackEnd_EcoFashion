const pool = require("../config/db");

async function cadastrarCompra(cliente_id, itens) {
    const conexao = await pool.getConnection();

    try {
        await conexao.beginTransaction();

        let valor_total = 0;
        const produtos = [];

        for (const item of itens) {
            const [produto] = await conexao.query(
                "SELECT id, preco, estoque FROM produto WHERE id = ?",
                [item.produto_id]
            );

            if (!produto) {
                throw new Error(`Produto ${item.produto_id} não encontrado.`);
            }

            if (item.quantidade <= 0 || produto.estoque < item.quantidade) {
                throw new Error(`Estoque insuficiente para o produto ${item.produto_id}.`);
            }

            const preco_unitario = Number(produto.preco);

            valor_total += preco_unitario * item.quantidade;

            produtos.push({
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario
            });
        }

        const resultadoPedido = await conexao.query(
            `INSERT INTO pedidos (data_pedido, valor_total, STATUS, cliente_id)
             VALUES (NOW(), ?, 'Pendente', ?)`,
            [valor_total, cliente_id]
        );

        const pedido_id = Number(resultadoPedido.insertId);

        for (const item of produtos) {
            await conexao.query(
                `INSERT INTO itens_pedido
                (quantidade, preco_unitario, pedido_id, produto_id)
                VALUES (?, ?, ?, ?)`,
                [
                    item.quantidade,
                    item.preco_unitario,
                    pedido_id,
                    item.produto_id
                ]
            );

            await conexao.query(
                "UPDATE produto SET estoque = estoque - ? WHERE id = ?",
                [item.quantidade, item.produto_id]
            );
        }

        await conexao.commit();

        return pedido_id;

    } catch (erro) {
        await conexao.rollback();
        throw erro;

    } finally {
        conexao.release();
    }
}

async function listarCompras() {
    return await pool.query(
        `SELECT * FROM pedidos ORDER BY id DESC`
    );
}

async function buscarCompraPorId(id) {
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
         WHERE pedidos.id = ?`,
        [id]
    );
}

module.exports = {
    cadastrarCompra,
    listarCompras,
    buscarCompraPorId
};

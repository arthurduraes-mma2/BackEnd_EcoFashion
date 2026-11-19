const pool = require("../config/db");

function criarErro(mensagem, statusCode = 400) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

async function cadastrarCompra(cliente_id, itens) {
    const conexao = await pool.getConnection();
    let transacaoIniciada = false;

    try {
        await conexao.beginTransaction();
        transacaoIniciada = true;

        // Verifica se o cliente existe.
        const clientes = await conexao.query(
            "SELECT id FROM clientes WHERE id = ?",
            [cliente_id]
        );

        if (clientes.length === 0) {
            throw criarErro("Cliente não encontrado.", 404);
        }

        let valor_total = 0;
        const produtos = [];

        for (const item of itens) {
            // Bloqueia a linha do produto durante a transação.
            const resultado = await conexao.query(
                `SELECT id, preco, estoque
                 FROM produto
                 WHERE id = ?
                 FOR UPDATE`,
                [item.produto_id]
            );

            if (resultado.length === 0) {
                throw criarErro(
                    `Produto ${item.produto_id} não encontrado.`,
                    404
                );
            }

            const produto = resultado[0];

            if (produto.estoque < item.quantidade) {
                throw criarErro(
                    `Estoque insuficiente para o produto ${item.produto_id}.`,
                    400
                );
            }

            const preco_unitario = Number(produto.preco);

            valor_total += preco_unitario * item.quantidade;

            produtos.push({
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario
            });
        }

        valor_total = Number(valor_total.toFixed(2));

        // Cadastra o pedido.
        const resultadoPedido = await conexao.query(
            `INSERT INTO pedidos
             (data_pedido, valor_total, STATUS, cliente_id)
             VALUES (NOW(), ?, 'Pendente', ?)`,
            [valor_total, cliente_id]
        );

        const pedido_id = Number(resultadoPedido.insertId);

        // Cadastra os itens e atualiza o estoque.
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
                `UPDATE produto
                 SET estoque = estoque - ?
                 WHERE id = ? AND estoque >= ?`,
                [
                    item.quantidade,
                    item.produto_id,
                    item.quantidade
                ]
            );
        }

        await conexao.commit();
        transacaoIniciada = false;

        return pedido_id;

    } catch (erro) {
        if (transacaoIniciada) {
            await conexao.rollback();
        }

        throw erro;

    } finally {
        conexao.release();
    }
}

async function listarCompras() {
    return await pool.query(
        `SELECT * FROM pedidos
         ORDER BY id DESC`
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
            produto.nome AS produto_nome,
            itens_pedido.quantidade,
            itens_pedido.preco_unitario
         FROM pedidos
         LEFT JOIN itens_pedido
            ON pedidos.id = itens_pedido.pedido_id
         LEFT JOIN produto
            ON itens_pedido.produto_id = produto.id
         WHERE pedidos.id = ?`,
        [id]
    );
}

module.exports = {
    cadastrarCompra,
    listarCompras,
    buscarCompraPorId
};

const pool = require("../config/db");

function criarErro(mensagem, statusCode = 400) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

async function criarCarrinho(cliente_id) {
    const clientes = await pool.query(
        "SELECT id FROM clientes WHERE id = ?",
        [cliente_id]
    );

    if (clientes.length === 0) {
        throw criarErro("Cliente não encontrado.", 404);
    }

    const resultado = await pool.query(
        "INSERT INTO carrinhos (cliente_id) VALUES (?)",
        [cliente_id]
    );

    return Number(resultado.insertId);
}

async function buscarCarrinhoPorCliente(cliente_id) {
    return await pool.query(
        `SELECT
            c.id AS carrinho_id,
            c.data_criacao,
            c.STATUS,
            ic.id AS item_id,
            ic.quantidade,
            ic.preco_unitario,
            p.id AS produto_id,
            p.nome AS produto,
            p.preco,
            p.estoque
        FROM carrinhos c
        LEFT JOIN itens_carrinhos ic ON c.id = ic.carrinho_id
        LEFT JOIN produto p ON ic.produto_id = p.id
        WHERE c.cliente_id = ? AND c.STATUS = 'ativo'
        ORDER BY ic.id`,
        [cliente_id]
    );
}

async function buscarCarrinhoPorId(id) {
    return await pool.query(
        `SELECT
            c.id AS carrinho_id,
            c.cliente_id,
            c.data_criacao,
            c.STATUS,
            ic.id AS item_id,
            ic.quantidade,
            ic.preco_unitario,
            p.id AS produto_id,
            p.nome AS produto,
            p.preco,
            p.estoque
        FROM carrinhos c
        LEFT JOIN itens_carrinhos ic ON c.id = ic.carrinho_id
        LEFT JOIN produto p ON ic.produto_id = p.id
        WHERE c.id = ?
        ORDER BY ic.id`,
        [id]
    );
}

async function adicionarProduto(carrinho_id, produto_id, quantidade) {
    const carrinhos = await pool.query(
        "SELECT id FROM carrinhos WHERE id = ? AND STATUS = 'ativo'",
        [carrinho_id]
    );

    if (carrinhos.length === 0) {
        throw criarErro("Carrinho não encontrado ou não está ativo.", 404);
    }

    const produtos = await pool.query(
        "SELECT id, preco, estoque FROM produto WHERE id = ?",
        [produto_id]
    );

    if (produtos.length === 0) {
        throw criarErro("Produto não encontrado.", 404);
    }

    const produto = produtos[0];

    const itens = await pool.query(
        `SELECT quantidade
        FROM itens_carrinhos
        WHERE carrinho_id = ? AND produto_id = ?`,
        [carrinho_id, produto_id]
    );

    const quantidadeAtual = itens.length > 0
        ? Number(itens[0].quantidade)
        : 0;

    if (quantidadeAtual + quantidade > Number(produto.estoque)) {
        throw criarErro("Quantidade solicitada maior que o estoque disponível.");
    }

    await pool.query(
        `INSERT INTO itens_carrinhos
        (quantidade, preco_unitario, carrinho_id, produto_id)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        quantidade = quantidade + VALUES(quantidade)`,
        [quantidade, produto.preco, carrinho_id, produto_id]
    );

    return {
        mensagem: "Produto adicionado ao carrinho com sucesso!"
    };
}

async function atualizarQuantidade(id, quantidade) {
    const itens = await pool.query(
        `SELECT
            ic.id,
            p.estoque,
            c.STATUS
        FROM itens_carrinhos ic
        INNER JOIN produto p ON ic.produto_id = p.id
        INNER JOIN carrinhos c ON ic.carrinho_id = c.id
        WHERE ic.id = ?`,
        [id]
    );

    if (itens.length === 0 || itens[0].STATUS !== "ativo") {
        throw criarErro("Item não encontrado em um carrinho ativo.", 404);
    }

    if (quantidade > Number(itens[0].estoque)) {
        throw criarErro("Quantidade solicitada maior que o estoque disponível.");
    }

    await pool.query(
        `UPDATE itens_carrinhos
        SET quantidade = ?
        WHERE id = ?`,
        [quantidade, id]
    );

    return {
        mensagem: "Quantidade atualizada com sucesso!"
    };
}

async function removerProduto(id) {
    const resultado = await pool.query(
        `DELETE ic FROM itens_carrinhos ic
        INNER JOIN carrinhos c ON ic.carrinho_id = c.id
        WHERE ic.id = ? AND c.STATUS = 'ativo'`,
        [id]
    );

    return resultado.affectedRows;
}

async function limparCarrinho(id) {
    const carrinhos = await pool.query(
        "SELECT id FROM carrinhos WHERE id = ? AND STATUS = 'ativo'",
        [id]
    );

    if (carrinhos.length === 0) {
        throw criarErro("Carrinho não encontrado ou não está ativo.", 404);
    }

    await pool.query(
        "DELETE FROM itens_carrinhos WHERE carrinho_id = ?",
        [id]
    );
}

module.exports = {
    criarCarrinho,
    buscarCarrinhoPorCliente,
    buscarCarrinhoPorId,
    adicionarProduto,
    atualizarQuantidade,
    removerProduto,
    limparCarrinho
};

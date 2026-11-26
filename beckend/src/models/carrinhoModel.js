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
            p.id AS produtos_id,
            p.nome AS produtos,
            p.preco,
            p.estoque
        FROM carrinhos c
        LEFT JOIN itens_carrinhos ic ON c.id = ic.carrinho_id
        LEFT JOIN produtos p ON ic.produtos_id = p.id
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
            p.id AS produtos_id,
            p.nome AS produtos,
            p.preco,
            p.estoque
        FROM carrinhos c
        LEFT JOIN itens_carrinhos ic ON c.id = ic.carrinho_id
        LEFT JOIN produtos p ON ic.produtos_id = p.id
        WHERE c.id = ?
        ORDER BY ic.id`,
        [id]
    );
}

async function adicionarProdutos(carrinho_id, produtos_id, quantidade) {
    const carrinhos = await pool.query(
        "SELECT id FROM carrinhos WHERE id = ? AND STATUS = 'ativo'",
        [carrinho_id]
    );

    if (carrinhos.length === 0) {
        throw criarErro("Carrinho não encontrado ou não está ativo.", 404);
    }

    const produtos = await pool.query(
        "SELECT id, preco, estoque FROM produtos WHERE id = ?",
        [produtos_id]
    );

    if (produtos.length === 0) {
        throw criarErro("Produtos não encontrado.", 404);
    }

    const produto = produtos[0];

    const itens = await pool.query(
        `SELECT quantidade
        FROM itens_carrinhos
        WHERE carrinho_id = ? AND produtos_id = ?`,
        [carrinho_id, produtos_id]
    );

    const quantidadeAtual = itens.length > 0
        ? Number(itens[0].quantidade)
        : 0;

    if (quantidadeAtual + quantidade > Number(produtos.estoque)) {
        throw criarErro("Quantidade solicitada maior que o estoque disponível.");
    }

    await pool.query(
        `INSERT INTO itens_carrinhos
        (quantidade, preco_unitario, carrinho_id, produtos_id)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        quantidade = quantidade + VALUES(quantidade)`,
        [quantidade, produtos.preco, carrinho_id, produtos_id]
    );

    return {
        mensagem: "Produtos adicionado ao carrinho com sucesso!"
    };
}

async function atualizarQuantidade(id, quantidade) {
    const itens = await pool.query(
        `SELECT
            ic.id,
            p.estoque,
            c.STATUS
        FROM itens_carrinhos ic
        INNER JOIN produtos p ON ic.produtos_id = p.id
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

async function removerProdutos(id) {
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
    adicionarProdutos,
    atualizarQuantidade,
    removerProdutos,
    limparCarrinho
};

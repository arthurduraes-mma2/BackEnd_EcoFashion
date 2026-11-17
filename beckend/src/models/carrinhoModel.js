const pool = require("../config/db");

async function criarCarrinho(cliente_id) {
    const resultado = await pool.query(
        "INSERT INTO carrinhos (cliente_id) VALUES (?)",
        [cliente_id]
    );

    return Number(resultado.insertId);
}

async function buscarCarrinhoPorCliente(cliente_id) {
    const resultado = await pool.query(
        `SELECT 
            c.id AS carrinho_id,
            c.data_criacao,
            c.STATUS,
            ic.id AS item_id,
            ic.quantidade,
            ic.preco_unitario,
            p.id AS produto_id,
            p.nome AS produto,
            p.preco
        FROM carrinhos c
        LEFT JOIN itens_carrinhos ic ON c.id = ic.carrinho_id
        LEFT JOIN produto p ON ic.produto_id = p.id
        WHERE c.cliente_id = ? AND c.STATUS = 'ativo'`,
        [cliente_id]
    );

    return resultado;
}

async function buscarCarrinhoPorId(id) {
    const resultado = await pool.query(
        `SELECT 
            c.id AS carrinho_id,
            c.data_criacao,
            c.STATUS,
            ic.id AS item_id,
            ic.quantidade,
            ic.preco_unitario,
            p.id AS produto_id,
            p.nome AS produto,
            p.preco
        FROM carrinhos c
        LEFT JOIN itens_carrinhos ic ON c.id = ic.carrinho_id
        LEFT JOIN produto p ON ic.produto_id = p.id
        WHERE c.id = ?`,
        [id]
    );

    return resultado;
}

async function adicionarProduto(carrinho_id, produto_id, quantidade) {
    const carrinho = await pool.query(
        "SELECT id FROM carrinhos WHERE id = ? AND STATUS = 'ativo'",
        [carrinho_id]
    );

    if (carrinho.length === 0) {
        throw new Error("Carrinho não encontrado ou não está ativo.");
    }

    const produtos = await pool.query(
        "SELECT id, preco, estoque FROM produto WHERE id = ?",
        [produto_id]
    );

    if (produtos.length === 0) {
        throw new Error("Produto não encontrado.");
    }

    const produto = produtos[0];

    const itens = await pool.query(
        "SELECT quantidade FROM itens_carrinhos WHERE carrinho_id = ? AND produto_id = ?",
        [carrinho_id, produto_id]
    );

    const quantidadeAtual = itens.length > 0 ? itens[0].quantidade : 0;

    if (quantidadeAtual + quantidade > produto.estoque) {
        throw new Error("Quantidade solicitada maior que o estoque disponível.");
    }

    await pool.query(
        `INSERT INTO itens_carrinhos
        (quantidade, preco_unitario, carrinho_id, produto_id)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)`,
        [quantidade, produto.preco, carrinho_id, produto_id]
    );

    return {
        mensagem: "Produto adicionado ao carrinho com sucesso!"
    };
}

async function atualizarQuantidade(id, quantidade) {
    const resultado = await pool.query(
        `UPDATE itens_carrinhos
        SET quantidade = ?
        WHERE id = ?`,
        [quantidade, id]
    );

    if (resultado.affectedRows === 0) {
        throw new Error("Item não encontrado no carrinho.");
    }

    return {
        mensagem: "Quantidade atualizada com sucesso!"
    };
}

async function removerProduto(id) {
    const resultado = await pool.query(
        "DELETE FROM itens_carrinhos WHERE id = ?",
        [id]
    );

    return resultado.affectedRows;
}

async function limparCarrinho(id) {
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

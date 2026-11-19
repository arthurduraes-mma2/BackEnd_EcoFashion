
    material VARCHAR(100),
    categoria_id INT NOT NULL,

    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE carrinhos(
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    STATUS VARCHAR(30) DEFAULT 'ativo',
    cliente_id INT NOT NULL,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE itens_carrinhos(
    id INT PRIMARY KEY AUTO_INCREMENT,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    carrinho_id INT NOT NULL,
    produto_id INT NOT NULL,

    FOREIGN KEY (carrinho_id) REFERENCES carrinhos(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id),

    UNIQUE (carrinho_id, produto_id)
);

CREATE TABLE pedidos(
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10,2) NOT NULL,
    STATUS VARCHAR(30) DEFAULT 'pendente',
    cliente_id INT NOT NULL,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE itens_pedido(
    id INT PRIMARY KEY AUTO_INCREMENT,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,

    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

CREATE TABLE notas_fiscais(
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(50) NOT NULL,
    serie VARCHAR(20),
    DATA_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10,2) NOT NULL,
    pedido_id INT NOT NULL UNIQUE,

    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

SHOW TABLES;
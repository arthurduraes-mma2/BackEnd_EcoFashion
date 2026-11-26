
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
    produtos_id INT NOT NULL,

    FOREIGN KEY (carrinho_id) REFERENCES carrinhos(id),
    FOREIGN KEY (produtos_id) REFERENCES produtos(id),

    UNIQUE (carrinho_id, produtos_id)
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
    produtos_id INT NOT NULL,

    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produtos_id) REFERENCES produtos(id)
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
CREATE TABLE IF NOT EXISTS clientes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    endereco VARCHAR(255)
);

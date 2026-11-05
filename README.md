"# BackEnd_EcoFashion" 

# EcoFashion - Back-End

## Sobre o Projeto

O **EcoFashion** é um projeto escolar de desenvolvimento de um e-commerce de roupas sustentáveis e upcycling.

A proposta é desenvolver uma plataforma de comércio eletrônico voltada à sustentabilidade, permitindo o cadastro de clientes, gerenciamento de produtos, carrinho de compras e realização de pedidos.

Este repositório contém o desenvolvimento do Back-End da aplicação, responsável pelo processamento das informações, comunicação com o banco de dados e disponibilização das rotas da API.

## Objetivo

Desenvolver uma API utilizando Node.js, Express e MariaDB, aplicando os conceitos de desenvolvimento Back-End, organização de código, operações CRUD e integração com banco de dados.

## Tecnologias utilizadas

- **Node.js:** ambiente de execução JavaScript.
- **Express:** criação do servidor e gerenciamento das rotas.
- **MariaDB:** banco de dados relacional.
- **HeidiSQL:** ferramenta utilizada para administrar o banco de dados.
- **JavaScript:** linguagem utilizada no desenvolvimento.
- **CORS:** permite a comunicação entre diferentes origens.
- **Dotenv:** gerenciamento das variáveis de ambiente.
- **Bcrypt:** criptografia das senhas dos clientes.
- **Bruno:** ferramenta utilizada para testar as requisições da API.
- **Git e GitHub:** controle de versão e armazenamento do projeto.

## Estrutura do Projeto

O projeto foi organizado em pastas para separar as responsabilidades de cada parte do sistema.

```text
BackEnd_EcoFashion/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── ProjetoEcoFashion.sql
│   │
│   ├── models/
│   │   ├── clienteModel.js
│   │   ├── cadastroModel.js
│   │   ├── loginModel.js
│   │   ├── compraModel.js
│   │   ├── vendaModel.js
│   │   ├── notaFiscalModel.js
│   │   ├── carrinhoModel.js
│   │   └── consultaModel.js
│   │
│   ├── controllers/
│   │   ├── clienteController.js
│   │   ├── cadastroController.js
│   │   ├── loginController.js
│   │   ├── compraController.js
│   │   ├── vendaController.js
│   │   ├── notaFiscalController.js
│   │   ├── carrinhoController.js
│   │   └── consultaController.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── clienteRoutes.js
│   │   ├── cadastroRoutes.js
│   │   ├── loginRoutes.js
│   │   ├── consultaRoutes.js
│   │   ├── compraRoutes.js
│   │   ├── vendaRoutes.js
│   │   ├── notaFiscalRoutes.js
│   │   └── carrinhoRoutes.js
│   │
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Organização das pastas

- **config:** configurações de conexão com o banco de dados e arquivo SQL.
- **models:** comunicação com o banco de dados e execução das consultas SQL.
- **controllers:** recebem as requisições e controlam as respostas da API.
- **routes:** definem os caminhos e os métodos HTTP disponíveis.
- **server.js:** inicialização e configuração do servidor.

## Banco de Dados

O banco de dados utilizado no projeto é o MariaDB, administrado pelo HeidiSQL.

**Nome do banco:** `ecofashion`

O banco foi planejado para armazenar informações de clientes, categorias, produtos, carrinhos, pedidos e notas fiscais.

### Tabelas criadas

| Tabela          | Finalidade                                      |
| --------------- | ----------------------------------------------- |
| clientes        | Armazenar os dados dos clientes                 |
| categorias      | Organizar os produtos por categorias            |
| produto         | Armazenar os produtos disponíveis               |
| carrinhos       | Registrar os carrinhos dos clientes             |
| itens_carrinhos | Armazenar os produtos adicionados aos carrinhos |
| pedidos         | Registrar os pedidos realizados                 |
| itens_pedido    | Armazenar os produtos de cada pedido            |
| notas_fiscais   | Registrar as notas fiscais dos pedidos          |

As tabelas utilizam chaves primárias e estrangeiras para estabelecer os relacionamentos entre os dados e manter a integridade referencial.

O script de criação do banco está localizado em:

`src/config/ProjetoEcoFashion.sql`

## Configuração do Projeto

### 1. Instalação das dependências

Para instalar as dependências, utilize o terminal na pasta do projeto:

```bash
npm install
```

As principais bibliotecas utilizadas são:

```bash
npm install express cors dotenv mariadb
```

Para a criptografia das senhas:

```bash
npm install bcrypt
```

### 2. Configuração das variáveis de ambiente

Na raiz do projeto, existe um arquivo `.env` responsável por armazenar as configurações de conexão com o banco de dados.

Exemplo:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha
DB_NAME=ecofashion
```

**Importante:** o arquivo `.env` não deve ser enviado ao GitHub, pois contém informações privadas de acesso ao banco de dados.

### 3. Inicialização do servidor

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Para iniciar normalmente:

```bash
npm start
```

Quando iniciado corretamente, o terminal apresenta:

```text
Servidor rodando na porta 3000
```

## Configuração da API

O servidor utiliza Express e CORS, além do middleware `express.json()` para permitir o recebimento de dados no formato JSON.

A API possui uma rota inicial:

```http
GET http://localhost:3000/
```

Resposta:

```text
API EcoFashion funcionando!
```

Também existe uma rota para verificar a conexão com o banco de dados:

```http
GET http://localhost:3000/conexao
```

Quando a conexão é realizada corretamente, a resposta é:

```text
Conexão com o banco realizada com sucesso!
```

## CRUD de Clientes

Uma das partes já desenvolvidas e testadas do projeto é o CRUD de clientes.

CRUD significa:

- **Create:** criar registros.
- **Read:** consultar registros.
- **Update:** atualizar registros.
- **Delete:** excluir registros.

O CRUD de clientes permite cadastrar, listar, atualizar e excluir clientes no banco de dados.

### 1. Listar clientes - GET

```http
GET http://localhost:3000/clientes
```

Retorna os clientes cadastrados no banco de dados.

### 2. Cadastrar cliente - POST

```http
POST http://localhost:3000/clientes
```

Exemplo de JSON enviado no Body:

```json
{
    "nome": "Cliente Teste",
    "email": "teste@ecofashion.com",
    "senha": "123456",
    "cpf": "12345678901",
    "telefone": "11999999999",
    "endereco": "São Paulo"
}
```

O sistema verifica os campos obrigatórios e utiliza o Bcrypt para gerar um hash da senha antes de armazená-la no banco de dados.

Resposta esperada:

```json
{
    "mensagem": "Cliente cadastrado com sucesso!"
}
```

### 3. Atualizar cliente - PUT

```http
PUT http://localhost:3000/clientes/1
```

Exemplo de JSON enviado no Body:

```json
{
    "nome": "Cliente Atualizado",
    "email": "atualizado@ecofashion.com",
    "cpf": "12345678901",
    "telefone": "11988888888",
    "endereco": "Osasco"
}
```

A atualização utiliza o ID do cliente para identificar qual registro será modificado.

Resposta esperada:

```json
{
    "mensagem": "Cliente atualizado com sucesso!"
}
```

### 4. Excluir cliente - DELETE

```http
DELETE http://localhost:3000/clientes/1
```

A exclusão utiliza o ID informado na URL.

Não é necessário enviar Body nessa requisição.

Resposta esperada:

```json
{
    "mensagem": "Cliente excluído com sucesso!"
}
```

## Segurança

O projeto utiliza algumas práticas para proteger as informações:

- Criptografia das senhas com Bcrypt.
- Uso de variáveis de ambiente para armazenar as configurações do banco.
- Arquivo `.gitignore` para evitar o envio de arquivos privados e da pasta `node_modules`.
- Consultas SQL parametrizadas para trabalhar com os dados recebidos.

## Testes da API

Os testes das requisições estão sendo realizados utilizando o Bruno.

Foram testados:

- GET para listar clientes.
- POST para cadastrar clientes.
- PUT para atualizar clientes.
- DELETE para excluir clientes.
- GET para verificar a conexão com o banco de dados.
- GET da rota inicial da API.

Os testes confirmaram o funcionamento das operações CRUD de clientes.

## Status do Desenvolvimento

### Concluído

- [x] Criação da estrutura inicial do projeto.
- [x] Inicialização do projeto Node.js.
- [x] Instalação das dependências.
- [x] Configuração do Express.
- [x] Configuração do CORS.
- [x] Configuração do Dotenv.
- [x] Configuração do MariaDB.
- [x] Criação e organização do banco de dados.
- [x] Criação das pastas Models, Controllers e Routes.
- [x] Configuração do servidor.
- [x] Teste da conexão com o banco.
- [x] CRUD completo de clientes.
- [x] Criptografia de senhas com Bcrypt.
- [x] Testes das operações de clientes no Bruno.
- [x] Configuração do Git e GitHub.
- [x] Criação do arquivo README.

### Em desenvolvimento

- [ ] Implementação e testes do cadastro de usuários.
- [ ] Implementação e testes do login.
- [ ] CRUD de produtos.
- [ ] Gerenciamento de categorias.
- [ ] Funcionalidades do carrinho de compras.
- [ ] Gerenciamento de compras e pedidos.
- [ ] Gerenciamento de vendas.
- [ ] Emissão e gerenciamento de notas fiscais.
- [ ] Desenvolvimento das consultas.
- [ ] Testes das demais rotas.
- [ ] Integração com o Front-End.

## Equipe

**Projeto:** EcoFashion - E-commerce de Roupas Sustentáveis e Upcycling.

**Desenvolvimento:** Projeto de Desenvolvimento de Sistemas.

**Responsabilidade deste repositório:** Back-End da aplicação.

## Considerações Finais

O desenvolvimento do Back-End do EcoFashion está sendo realizado por etapas, começando pela configuração do ambiente, conexão com o banco de dados e organização da arquitetura do projeto.

Até o momento, o CRUD de clientes foi implementado e testado com sucesso, incluindo o cadastro, listagem, atualização e exclusão de registros.

O projeto continuará sendo desenvolvido com a implementação dos demais módulos e a futura integração com o Front-End, buscando construir uma aplicação funcional de comércio eletrônico sustentável.

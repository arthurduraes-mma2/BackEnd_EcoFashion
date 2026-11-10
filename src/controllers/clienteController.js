
const clienteModel = require("../models/clienteModel");
const bcrypt = require("bcrypt");

async function listarClientes(req, res) {
    try {
        const clientes = await clienteModel.listarClientes();

        res.json(clientes);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao consultar clientes."
        });
    }
}

async function cadastrarCliente(req, res) {
    try {
        const { nome, email, senha, cpf, telefone, endereco } = req.body;

        if (!nome || !email || !senha || !cpf) {
            return res.status(400).json({
                mensagem: "Nome, email, senha e CPF são obrigatórios."
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await clienteModel.cadastrarCliente(
            nome,
            email,
            senhaCriptografada,
            cpf,
            telefone,
            endereco
        );

        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!"
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao cadastrar cliente."
        });
    }
}

async function atualizarCliente(req, res) {
    try {
        const { id } = req.params;
        const { nome, email, cpf, telefone, endereco } = req.body;

        if (!nome || !email || !cpf) {
            return res.status(400).json({
                mensagem: "Nome, email e CPF são obrigatórios."
            });
        }

        const resultado = await clienteModel.atualizarCliente(
            id,
            nome,
            email,
            cpf,
            telefone,
            endereco
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Cliente não encontrado."
            });
        }

        res.json({
            mensagem: "Cliente atualizado com sucesso!"
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao atualizar cliente."
        });
    }
}

async function excluirCliente(req, res) {
    try {
        const { id } = req.params;

        const resultado = await clienteModel.excluirCliente(id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Cliente não encontrado."
            });
        }

        res.json({
            mensagem: "Cliente excluído com sucesso!"
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao excluir cliente."
        });
    }
}

module.exports = {
    listarClientes,
    cadastrarCliente,
    atualizarCliente,
    excluirCliente
};
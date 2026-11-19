const clienteModel = require("../models/clienteModel");

async function listarClientes(req, res) {
    try {
        const clientes = await clienteModel.listarClientes();

        return res.status(200).json(clientes);
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao consultar clientes."
        });
    }
}

async function atualizarCliente(req, res) {
    try {
        const id = Number(req.params.id);
        let { nome, email, cpf, telefone, endereco } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do cliente inválido."
            });
        }

        nome = typeof nome === "string" ? nome.trim() : "";
        email = typeof email === "string" ? email.trim() : "";
        cpf = typeof cpf === "string" ? cpf.trim() : "";

        if (!nome || !email || !cpf) {
            return res.status(400).json({
                mensagem: "Nome, email e CPF são obrigatórios."
            });
        }

        if (nome.length > 100 || email.length > 150 || cpf.length > 11) {
            return res.status(400).json({
                mensagem: "Um ou mais campos ultrapassaram o limite permitido."
            });
        }

        if (!email.includes("@")) {
            return res.status(400).json({
                mensagem: "Email inválido."
            });
        }

        if (telefone && telefone.length > 20) {
            return res.status(400).json({
                mensagem: "Telefone ultrapassou o limite de 20 caracteres."
            });
        }

        if (endereco && endereco.length > 200) {
            return res.status(400).json({
                mensagem: "Endereço ultrapassou o limite de 200 caracteres."
            });
        }

        const resultado = await clienteModel.atualizarCliente(
            id,
            nome,
            email,
            cpf,
            telefone || null,
            endereco || null
        );

        if (!resultado.clienteExiste) {
            return res.status(404).json({
                mensagem: "Cliente não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Cliente atualizado com sucesso!"
        });
    } catch (erro) {
        console.error(erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "Email ou CPF já cadastrado."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao atualizar cliente."
        });
    }
}

async function excluirCliente(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do cliente inválido."
            });
        }

        const resultado = await clienteModel.excluirCliente(id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Cliente não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Cliente excluído com sucesso!"
        });
    } catch (erro) {
        console.error(erro);

        if (erro.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                mensagem: "Não é possível excluir este cliente porque existem registros vinculados a ele."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao excluir cliente."
        });
    }
}

module.exports = {
    listarClientes,
    atualizarCliente,
    excluirCliente
};

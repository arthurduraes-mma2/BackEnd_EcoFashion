const cadastroModel = require("../models/cadastroModel");
const bcrypt = require("bcrypt");

async function cadastrar(req, res) {
    try {
        const { nome, email, senha, cpf, telefone, endereco } = req.body;

        if (!nome || !email || !senha || !cpf) {
            return res.status(400).json({
                mensagem: "Nome, email, senha e CPF são obrigatórios."
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await cadastroModel.cadastrar(
            nome,
            email,
            senhaCriptografada,
            cpf,
            telefone || null,
            endereco || null
        );

        return res.status(201).json({
            mensagem: "Cadastro realizado com sucesso!"
        });

    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "Email ou CPF já cadastrado."
            });
        }

        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao realizar cadastro."
        });
    }
}

module.exports = {
    cadastrar
};

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

        if (
            typeof nome !== "string" ||
            typeof email !== "string" ||
            typeof senha !== "string" ||
            typeof cpf !== "string"
        ) {
            return res.status(400).json({
                mensagem: "Os dados enviados são inválidos."
            });
        }

        const nomeFormatado = nome.trim();
        const emailFormatado = email.trim().toLowerCase();
        const cpfFormatado = cpf.replace(/\D/g, "");

        if (!nomeFormatado || !emailFormatado || !senha.trim() || !cpfFormatado) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        if (nomeFormatado.length > 100 ||
            emailFormatado.length > 150 ||
            cpfFormatado.length !== 11 ||
            !/^\d{11}$/.test(cpfFormatado)) {
            return res.status(400).json({
                mensagem: "Confira o nome, email e CPF informados."
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await cadastroModel.cadastrar(
            nomeFormatado,
            emailFormatado,
            senhaCriptografada,
            cpfFormatado,
            telefone ? String(telefone).replace(/\D/g, "") : null,
            endereco ? String(endereco).trim() : null
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

        console.error("ERRO NO CADASTRO:", erro);

        return res.status(500).json({
            mensagem: `Erro ao realizar cadastro: ${erro.sqlMessage || erro.message}`
        });
    }
}

module.exports = {
    cadastrar
};
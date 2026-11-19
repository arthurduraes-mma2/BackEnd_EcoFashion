const loginModel = require("../models/loginModel");
const bcrypt = require("bcrypt");

async function realizarLogin(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Email e senha são obrigatórios."
            });
        }

        if (typeof email !== "string" || typeof senha !== "string") {
            return res.status(400).json({
                mensagem: "Email e senha inválidos."
            });
        }

        const emailFormatado = email.trim().toLowerCase();

        const cliente = await loginModel.buscarClientePorEmail(emailFormatado);

        if (!cliente) {
            return res.status(401).json({
                mensagem: "Email ou senha incorretos."
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, cliente.senha);

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: "Email ou senha incorretos."
            });
        }

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            cliente: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email
            }
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao realizar login."
        });
    }
}

module.exports = {
    realizarLogin
};

const notaFiscalModel = require("../models/notaFiscalModel");

async function emitirNotaFiscal(req, res) {
    try {
        const { pedido_id } = req.body;

        if (!pedido_id) {
            return res.status(400).json({
                mensagem: "O ID do pedido é obrigatório."
            });
        }

        const nota_id = await notaFiscalModel.emitirNotaFiscal(pedido_id);

        return res.status(201).json({
            mensagem: "Nota fiscal emitida com sucesso!",
            nota_id
        });

    } catch (erro) {
        return res.status(400).json({
            mensagem: erro.message
        });
    }
}

async function listarNotasFiscais(req, res) {
    try {
        const notas = await notaFiscalModel.listarNotasFiscais();

        return res.status(200).json(notas);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao listar notas fiscais.",
            erro: erro.message
        });
    }
}

async function buscarNotaFiscalPorId(req, res) {
    try {
        const { id } = req.params;

        const nota = await notaFiscalModel.buscarNotaFiscalPorId(id);

        if (nota.length === 0) {
            return res.status(404).json({
                mensagem: "Nota fiscal não encontrada."
            });
        }

        return res.status(200).json(nota);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao buscar nota fiscal.",
            erro: erro.message
        });
    }
}

module.exports = {
    emitirNotaFiscal,
    listarNotasFiscais,
    buscarNotaFiscalPorId
};

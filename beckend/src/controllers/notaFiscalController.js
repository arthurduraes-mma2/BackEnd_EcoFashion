const notaFiscalModel = require("../models/notaFiscalModel");

async function emitirNotaFiscal(req, res) {
    try {
        const pedido_id = Number(req.body?.pedido_id);

        if (!Number.isInteger(pedido_id) || pedido_id <= 0) {
            return res.status(400).json({
                mensagem: "Informe um ID de pedido válido."
            });
        }

        const nota_id = await notaFiscalModel.emitirNotaFiscal(pedido_id);

        return res.status(201).json({
            mensagem: "Nota fiscal emitida com sucesso!",
            nota_id
        });

    } catch (erro) {
        return res.status(erro.statusCode || 500).json({
            mensagem: erro.message || "Erro ao emitir nota fiscal."
        });
    }
}

async function listarNotasFiscais(req, res) {
    try {
        const notas = await notaFiscalModel.listarNotasFiscais();

        return res.status(200).json(notas);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao listar notas fiscais."
        });
    }
}

async function buscarNotaFiscalPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "Informe um ID de nota fiscal válido."
            });
        }

        const nota = await notaFiscalModel.buscarNotaFiscalPorId(id);

        if (nota.length === 0) {
            return res.status(404).json({
                mensagem: "Nota fiscal não encontrada."
            });
        }

        return res.status(200).json(nota);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao buscar nota fiscal."
        });
    }
}

module.exports = {
    emitirNotaFiscal,
    listarNotasFiscais,
    buscarNotaFiscalPorId
};

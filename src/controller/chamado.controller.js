const chamadoService = require("../service/chamado.service");

const chamadoStatus = require("../enum/enumStatus");

const create = async (req, res) => {
    const { titulo, descricao, prioridade } = req.body;

    try {
        const chamado = await chamadoService.create(
            titulo,
            descricao,
            prioridade
        );

        res.status(201).json(chamado);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao criar chamado"
        });
    }
};

const list = async (req, res) => {
    try {
        const result = await chamadoService.list();

        res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao listar chamados"
        });
    }
}

const update = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, prioridade } = req.body;

    try {
        const result = await chamadoService.update(
            titulo, 
            descricao, 
            prioridade,
            id
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao atualizar chamado"
        });
    }
}

const update_status = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!Object.values(chamadoStatus).includes(status)) {
            return res.status(400).json({
                mensagem: "Status inválido"
            });
        }

        const result = await chamadoService.update_status(
            status,
            id,
            req.user.id
        );

        if (chamado.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        }

        res.result(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao atualizar status do chamado"
        });
    }
}

const update_priority = async (req, res) => {
    const { id } = req.params;
    const { prioridade } = req.body;

    try {
        const result = await chamadoService.update_priority(
            id,
            prioridade
        );

        if (!result) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        }

        return res.status(200).json({
            mensagem: "Prioridade atualizada com sucesso",
            chamado: result
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao atualizar a prioridade do chamado"
        });
    }
}

const delete_chamado = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await chamadoService.delete_chamado(
            id
        );

        if (!result) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        }

        return res.status(200).json({
            mensagem: "Chamado deletado com sucesso",
            chamado: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao Deletar o chamado"
        });
    }
}

module.exports = {
    create,
    list,
    update,
    update_status,
    update_priority,
    delete_chamado
};
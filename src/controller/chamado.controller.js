const chamadoService = require("../service/chamado.service");

const chamadoStatus = require("../enum/enumStatus");

const create = async (req, res) => {
    const { titulo, descricao, prioridade} = req.body;

    const user_id = req.user.id;

    try {
        const chamado = await chamadoService.create(
            titulo,
            descricao,
            prioridade,
            user_id
        );

        res.status(201).json(chamado);

    } catch (error) {
        console.error(error);

        console.log(req.body)
        res.status(500).json({
            mensagem: "Erro ao criar chamado"
        });
    }
};

const list = async (req, res) => {
    const role = req.user.role;
    const id = req.user.id;

    try {
        if (role === "admin") {
            const result = await chamadoService.list();

            return res.status(200).json(result);
        } else {
            const result = await chamadoService.listbyuser(id);

            return res.status(200).json(result);
        }

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao listar chamados"
        });
    }
};

const listbyuser = async (req, res) => {
    const id = req.user.id;

    try {
        const result = await chamadoService.listbyuser(
            id
        );

        if (!result) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        };

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao listar chamados"
        });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, prioridade, user_id } = req.body;

    try {
        const result = await chamadoService.update(
            titulo, 
            descricao, 
            prioridade,
            id,
            user_id
        );

        if (!result) {
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

    const user_id = req.user.id;
    try {
        if (!Object.values(chamadoStatus).includes(status)) {
            console.log(status)
            return res.status(400).json({
                mensagem: "Status inválido"
            });

        }
        
        const result = await chamadoService.update_status(
            status,
            id,
            user_id
        );
        
        if (!result) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        }

        res.status(201).json(result);
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
    listbyuser,
    update,
    update_status,
    update_priority,
    delete_chamado
};
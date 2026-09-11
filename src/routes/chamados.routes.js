const express = require("express");

const pool = require("../database/database");

const router = express.Router();

const roleMiddleware = require("../middleware/role");

const authMiddleware = require("../middleware/auth");

const chamadoStatus = require("../enum/enumStatus");

router.post("/create", authMiddleware, async (req, res) => {
    const { titulo, descricao, prioridade } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO chamados (titulo, descricao, prioridade)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [titulo, descricao, prioridade]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao criar chamado"
        });
    }
});

router.get("/list", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM chamados");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao listar chamados"
        });
    }
});

router.put("/update/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, prioridade } = req.body;

    try {
        const result = await pool.query(
            `UPDATE chamados
                SET titulo = $1, descricao = $2, prioridade = $3
                WHERE id = $4
                RETURNING *`,
            [titulo, descricao, prioridade, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao atualizar chamado"
        });
    }
});

router.put("/update-status/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {

        // VERIFICA SE O STATUS INFORMADO É VÁLIDO
        if (!Object.values(chamadoStatus).includes(status)) {
            return res.status(400).json({
                mensagem: "Status inválido"
            });
        }

        // CONSULTA NO BANCO O CHAMADO
        const chamado = await pool.query(
            `SELECT * FROM chamados WHERE id = $1`,
            [id]
        );

        // VERIFICA SE O CHAMADO EXISTE
        if (chamado.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        }

        // SALVA O STATUS ATUAL DO CHAMADO
        const statusAnterior = chamado.rows[0].status;

        // ATUALIZA O STATUS DO CHAMADO NO BANCO
        const result = await pool.query(
            `UPDATE chamados
                SET status = $1
                WHERE id = $2
                RETURNING *`,
            [status, id]
        );

        // INSERE O REGISTRO DA ALTERAÇÃO NA TABELA DE HISTÓRICO
        await pool.query(
            `INSERT INTO historico_chamados
                (chamado_id, user_id, status_anterior, status_novo)
            VALUES ($1, $2, $3, $4)`,
            [id, req.user.id, statusAnterior, status]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao atualizar status do chamado"
        });
    }
});

router.put("/update-priority/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { prioridade } = req.body;

    try {
        const result = await pool.query(
            `UPDATE chamados
            SET prioridade = $1
            WHERE id = $2
            RETURNING *`,
            [prioridade, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao atualizar a prioridade do chamado"
        });
    }
})

router.delete("/delete/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
        `DELETE FROM chamados
        WHERE id = $1
        RETURNING *`,
        [id]
        );
    if (result.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Chamado não encontrado"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao Deletar o chamado"
        });
    }
})

module.exports = router;
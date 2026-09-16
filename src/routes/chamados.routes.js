const express = require("express");

const router = express.Router();

const roleMiddleware = require("../middleware/role");
const authMiddleware = require("../middleware/auth");

const chamadoController = require("../controller/chamado.controller");


/**
 * @swagger
 * /chamados/create:
 *   post:
 *     summary: Cria um novo chamado
 *     tags:
 *       - Chamados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - prioridade
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Problema no sistema
 *               descricao:
 *                 type: string
 *                 example: O sistema apresenta erro ao realizar o login.
 *               prioridade:
 *                 type: string
 *                 example: alta
 *     responses:
 *       201:
 *         description: Chamado criado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao criar chamado
 */
router.post(
    "/create",
    authMiddleware,
    chamadoController.create
);


/**
 * @swagger
 * /chamados/list:
 *   get:
 *     summary: Lista os chamados
 *     tags:
 *       - Chamados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de chamados retornada com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao listar chamados
 */
router.get(
    "/list",
    authMiddleware,
    chamadoController.list
);


/**
 * @swagger
 * /chamados/listbyuser:
 *   get:
 *     summary: Lista os chamados do usuário logado
 *     tags:
 *       - Chamados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chamados do usuário retornados com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Chamado não encontrado
 *       500:
 *         description: Erro ao listar chamados
 */
router.get(
    "/listbyuser",
    authMiddleware,
    chamadoController.listbyuser
);


/**
 * @swagger
 * /chamados/update/{id}:
 *   put:
 *     summary: Atualiza um chamado
 *     tags:
 *       - Chamados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do chamado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - prioridade
 *               - user_id
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Problema atualizado
 *               descricao:
 *                 type: string
 *                 example: Descrição atualizada do problema.
 *               prioridade:
 *                 type: string
 *                 example: alta
 *               user_id:
 *                 type: integer
 *                 example: 14
 *     responses:
 *       201:
 *         description: Chamado atualizado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Chamado não encontrado
 *       500:
 *         description: Erro ao atualizar chamado
 */
router.put(
    "/update/:id",
    authMiddleware,
    chamadoController.update
);


/**
 * @swagger
 * /chamados/update-status/{id}:
 *   put:
 *     summary: Atualiza o status de um chamado
 *     tags:
 *       - Chamados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do chamado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: aberto
 *     responses:
 *       201:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Status inválido
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Chamado não encontrado
 *       500:
 *         description: Erro ao atualizar status do chamado
 */
router.put(
    "/update-status/:id",
    authMiddleware,
    chamadoController.update_status
);


/**
 * @swagger
 * /chamados/update-priority/{id}:
 *   put:
 *     summary: Atualiza a prioridade de um chamado
 *     tags:
 *       - Chamados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do chamado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prioridade
 *             properties:
 *               prioridade:
 *                 type: string
 *                 example: alta
 *     responses:
 *       200:
 *         description: Prioridade atualizada com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Chamado não encontrado
 *       500:
 *         description: Erro ao atualizar a prioridade do chamado
 */
router.put(
    "/update-priority/:id",
    authMiddleware,
    chamadoController.update_priority
);


/**
 * @swagger
 * /chamados/delete/{id}:
 *   delete:
 *     summary: Exclui um chamado
 *     tags:
 *       - Chamados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do chamado
 *     responses:
 *       200:
 *         description: Chamado deletado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário não possui permissão de administrador
 *       404:
 *         description: Chamado não encontrado
 *       500:
 *         description: Erro ao deletar o chamado
 */
router.delete(
    "/delete/:id",
    authMiddleware,
    roleMiddleware("admin"),
    chamadoController.delete_chamado
);


module.exports = router;
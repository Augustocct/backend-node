const express = require("express");

const roleMiddleware = require("../middleware/role");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const loginController = require("../controller/login.controller");


/**
 * @swagger
 * /login/criar:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário não possui permissão de administrador
 *       500:
 *         description: Erro ao criar usuário
 */
router.post(
    "/criar",
    authMiddleware,
    roleMiddleware("admin"),
    loginController.create
);


/**
 * @swagger
 * /login/delete/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário não possui permissão de administrador
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao deletar o usuário
 */
router.delete(
    "/delete/:id",
    authMiddleware,
    roleMiddleware("admin"),
    loginController.delete_user
);


/**
 * @swagger
 * /login/entrar:
 *   post:
 *     summary: Realiza login do usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Senha inválida
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao realizar login
 */
router.post(
    "/entrar",
    loginController.entrar
);


/**
 * @swagger
 * /login/sair:
 *   post:
 *     summary: Realiza logout do usuário
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token não informado
 */
router.post(
    "/sair",
    authMiddleware,
    loginController.sair
);


module.exports = router;
const express = require("express");

const pool = require("../database/database");

const blacklist = require("../service/tokenBlacklist");

const roleMiddleware = require("../middleware/role");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

const jwt = require('jsonwebtoken');

const loginController = require("../controller/login.controller");

router.post(
    "/criar",
    authMiddleware,
    roleMiddleware("admin"),
    loginController.create
);

router.delete(
    "/delete/:id",
    authMiddleware,
    roleMiddleware("admin"),
    loginController.delete_user
);

router.post("/entrar", async (req, res) => {
    // PEGA O EMAIL E A SENHA DA REQUISICAO
    const { email, password } = req.body;

    // TENTA CONSULTAR O BANCO E BUSCAR PELO EMAIL E VER SE O USER EXISTE
    try {
        const result = await pool.query(
            `SELECT id, name, email, password_hash, role
             FROM users
             WHERE email = $1`,
            [email]
        );

        // CONDICAO PRA VERIFICAR SE A CONSULTA RETORNOU MAIS DE UM RESULTADO CASO NAO RETORNA USUARIO NAO ENCONTRADO
        if (result.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        // PEGA O PRIMEIRO USUÁRIO RETORNADO PELA CONSULTA
        const user = result.rows[0];

        // VE SE A SENHA ENVIADA NA REQUISIÇAO BATE COM A SENHA DO BANCO
        if (password !== user.password) {
            console.log(password)
            return res.status(401).json({
                mensagem: "Senha inválida"
            });
        }

        // CRIA O PAYLOAD PARA GERAR O TOKEN
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        // PEGA O SECRET ARMAZENADO NO .ENV
        const secret = process.env.JWT_SECRET;

        //FAZ A ASSINATURA DO TOKEN JWT E GERA O TOKEN
        const token = jwt.sign(payload, secret, {
            expiresIn: "15m"
        });
        
        //SE VOLTOU 200 CAI AQUI
        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            accessToken: token
        });
        
        
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({
            mensagem: "Erro ao realizar login"
        });
    }
});

router.post("/sair", authMiddleware, (req, res) => {

    //PEGA O TOKEN DA SESSAO ATUAL
    const authHeader = req.headers["authorization"];

    //VALIDA SE A SESSAO ATUAL TEM TOKEN
    if (!authHeader) {
        return res.status(401).json({
            message: "Token não informado"
        });
    }

    //TIRA O BEARER DA FRENTE DO TOKEN E DEIXA SOMENTE O TOKEN DE FATO
    //TIPO BEARER KOAFJAIFJAIJDAIJDIAJIEJIEJEIAJIAJRE$!$!@$#$@4234234233
    //FICARIA KOAFJAIFJAIJDAIJDIAJIEJIEJEIAJIAJRE$!$!@$#$@4234234233
    const token = authHeader.replace("Bearer ", "");

    //ADICIONA O TOKEN NA BLACKLIST PARA NAO CONSEGUIR MAIS REALIZAR O LOGIN COM O TOKEN, SERVICO FEITO NO ARQUIVO tokenBlacklist.js
    blacklist.add(token);

    //RETORNA O OK PARA A OPERAÇÂO DE SAIR
    return res.status(200).json({
        mensagem: "Logout realizado com sucesso"
    });
});

module.exports = router;
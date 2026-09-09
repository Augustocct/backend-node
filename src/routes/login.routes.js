const express = require("express");

const pool = require("../database/database");

const router = express.Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

router.post("/criar", async (req, res) => {
    const { name, email, password, role} = req.body;

    try {
        const saltRounds = 10;

        const passwordHash = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, email, passwordHash, role]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao criar usuário"
        });
    }
})

router.post("/entrar", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT id, name, email, password_hash
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        const user = result.rows[0];

        if (password !== user.password) {
            console.log(password)
            return res.status(401).json({
                mensagem: "Senha inválida"
            });
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        const secret = process.env.JWT_SECRET;

        const token = jwt.sign(payload, secret, {
            expiresIn: "15m"
        });

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

module.exports = router;
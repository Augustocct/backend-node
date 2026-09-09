const express = require("express");
const logger = require('./middleware/logger');

const app = express();

const authMiddleware = require("./middleware/auth");

const chamadosRoutes = require("./routes/chamados.routes");

const loginRoutes = require("./routes/login.routes");

app.use(logger);

app.use(express.json());

app.use("/login", loginRoutes);

app.use("/chamados", authMiddleware, chamadosRoutes);


app.get("/", authMiddleware, async (req, res) => {
    res.json({
        mensagem: "API de chamados funcionando!"
    });
});

app.get("/chamados", authMiddleware, async (req, res) => {
    res.json({
        mensagem: "precisa estar logado!"
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});

const pool = require("./database/database");

pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.error("Erro ao conectar no banco:", error);
        return;
    }

    console.log("Banco conectado!");
    console.log(result.rows);
});
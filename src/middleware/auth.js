const jwt = require("jsonwebtoken");

const blacklist = require("../service/tokenBlacklist");

const authMiddleware = (req, res, next) => {

    // PEGA O TOKEN DA SESSAO ATUAL
    const authHeader = req.headers.authorization;

    // VE SE O TOKEN FOI INFORMADO
    if (!authHeader) {
        return res.status(401).json({
            message: "Token não informado"
        });
    }

    // RETIRA O BEARER DO TOKEN 
    const token = authHeader.replace("Bearer ", "");

    // VERIFICA SE O TOKEN FOI REVOGADO
     if (blacklist.has(token)) {
        return res.status(401).json({
            message: "Token revogado"
        });
    }


    try {

        // VALIDA O TOKEN E RECUPERA OS DADOS DO USUÁRIO
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // ARMAZENA OS DADOS DO USUÁRIO NA REQUISIÇÃO
        req.user = decoded;

        return next();

    } catch (err) {

        // RETORNA ERRO CASO O TOKEN SEJA INVÁLIDO OU EXPIRADO
        return res.status(401).json({
            message: err.message
        });
    }
}

module.exports = authMiddleware
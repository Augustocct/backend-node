const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const loginService = require("../service/login.service");

const blacklist = require("../service/tokenBlacklist");

const create = async (req, res) => {
    const { name, email, password, role} = req.body;

    try {
        const saltRounds = 10;
        
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const usuario = await loginService.create(
            name,
            email,
            passwordHash,
            role
        );
        
        res.status(201).json(usuario);

    } catch (error) {
        console.error(error);

        res.status(500).json({
        mensagem: "Erro ao criar usuário"
        });
    }
}

const delete_user = async (req, res) => {
    const {id} = req.params;

    try {

        const deletedUser = await loginService.deleteUserById(
            id
        );

        if (!deletedUser) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        return res.status(200).json({
            mensagem: "Usuário deletado com sucesso",
            chamado: deletedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensagem: "Erro ao Deletar o usuario"
        });
    }
}

const entrar = async (req, res) => {
    const { email, password } = req.body;

    
    try {
        
        const result = await loginService.entrar(
            email, password
        );

        if (!result) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        const user = result;

        if (password !== user.password) {
            console.log(password)
            return res.status(401).json({
                mensagem: "Senha inválida"
            });
        }

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
};

const sair = async (req, res) => {
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
}

module.exports = {
    create,
    delete_user,
    entrar,
    sair
};
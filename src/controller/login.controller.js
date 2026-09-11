const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const loginService = require("../service/login.service")

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

module.exports = {
    create,
    delete_user
};
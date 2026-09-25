# API de Chamados

API REST para gerenciamento de chamados, desenvolvida como parte do meu processo de aprendizado em desenvolvimento backend.

O projeto foi desenvolvido utilizando Node.js, Express e PostgreSQL, com autenticação de usuários, controle de acesso por perfil e testes automatizados.

## 🚀 Tecnologias

- Node.js
- Express
- PostgreSQL
- JWT
- Bcrypt
- Jest
- Dotenv
- Nodemon

## 📋 Funcionalidades

### Usuários
- Login de usuários
- Autenticação utilizando JWT
- Controle de acesso por perfil
- Senhas armazenadas de forma criptografada

### Chamados
- Criar chamados
- Listar chamados
- Listar chamados por usuário
- Atualizar chamados
- Alterar status
- Alterar prioridade
- Excluir chamados

### Histórico
- Registro das alterações realizadas nos chamados

## 🔐 Autenticação

A API utiliza JWT (JSON Web Token) para autenticação.

Após realizar o login, o usuário recebe um token que deve ser enviado nas requisições protegidas através do header:

```http
Authorization: Bearer SEU_TOKEN

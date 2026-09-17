const loginService = require("../service/login.service");

describe("Login Service", () => {

    test("deve logar um usuário pelo email", async () => {

        const usuario = await loginService.entrar("222@gmail.com");

        expect(usuario).toBeDefined();
        expect(usuario.email).toBe("222@gmail.com");

    });

    test("não deve encontrar usuário com email inexistente", async () => {

        const usuario = await loginService.entrar("emailnaoexiste@gmail.com");

        expect(usuario).toBeUndefined();

    });

});


describe("Create User Service", () => {

    test("deve criar um usuário", async () => {

        const email = `teste_${Date.now()}@gmail.com`;

        const usuario = await loginService.create(
            "Teste Jest",
            email,
            "passwordhash",
            "user"
        );

        expect(usuario).toBeDefined();
        expect(usuario.name).toBe("Teste Jest");
        expect(usuario.email).toBe(email);
        expect(usuario.role).toBe("user");

        await loginService.deleteUserById(usuario.id);
    });

});


describe("Delete User Service", () => {

    test("deve excluir um usuário pelo id", async () => {

        const usuario = await loginService.create(
            "Usuário Delete",
            "delete_jest@gmail.com",
            "passwordhash",
            "user"
        );

        expect(usuario).toBeDefined();

        const usuarioDeletado = await loginService.deleteUserById(
            usuario.id
        );

        expect(usuarioDeletado).toBeDefined();
        expect(usuarioDeletado.id).toBe(usuario.id);

    });

});
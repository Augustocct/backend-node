const chamadoService = require("../service/chamado.service");
const chamadoStatus = require("../enum/enumStatus");

describe("Chamado Service", () => {

    test("deve criar um chamado", async () => {

        const chamado = await chamadoService.create(
            "Chamado de teste",
            "Descrição do chamado de teste",
            "media",
            14
        );

        expect(chamado).toBeDefined();
        expect(chamado.titulo).toBe("Chamado de teste");
        expect(chamado.descricao).toBe("Descrição do chamado de teste");
        expect(chamado.prioridade).toBe("media");
        expect(chamado.user_id).toBe(14);

    });


    test("deve listar todos os chamados", async () => {

        const chamados = await chamadoService.list();

        expect(chamados).toBeDefined();
        expect(Array.isArray(chamados)).toBe(true);

    });


    test("deve listar os chamados de um usuário", async () => {

        const chamados = await chamadoService.listbyuser(14);

        expect(chamados).toBeDefined();
        expect(Array.isArray(chamados)).toBe(true);

        chamados.forEach(chamado => {
            expect(chamado.user_id).toBe(14);
        });

    });


    test("deve atualizar um chamado", async () => {

        const chamadoCriado = await chamadoService.create(
            "Chamado para atualizar",
            "Descrição antiga",
            "media",
            14
        );

        const chamadoAtualizado = await chamadoService.update(
            "Chamado atualizado",
            "Descrição atualizada",
            "alta",
            chamadoCriado.id,
            14
        );

        expect(chamadoAtualizado).toBeDefined();
        expect(chamadoAtualizado.id).toBe(chamadoCriado.id);
        expect(chamadoAtualizado.titulo).toBe("Chamado atualizado");
        expect(chamadoAtualizado.descricao).toBe("Descrição atualizada");
        expect(chamadoAtualizado.prioridade).toBe("alta");
        expect(chamadoAtualizado.user_id).toBe(14);

    });


    test("deve atualizar o status de um chamado", async () => {

        const chamadoCriado = await chamadoService.create(
            "Chamado status",
            "Teste de atualização de status",
            "media",
            14
        );

        const chamadoAtualizado = await chamadoService.update_status(
            chamadoStatus.EM_ANDAMENTO,
            chamadoCriado.id,
            14
        );

        expect(chamadoAtualizado).toBeDefined();
        expect(chamadoAtualizado.id).toBe(chamadoCriado.id);
        expect(chamadoAtualizado.status).toBe(
            chamadoStatus.EM_ANDAMENTO
        );

    });


    test("deve atualizar a prioridade de um chamado", async () => {

        const chamadoCriado = await chamadoService.create(
            "Chamado prioridade",
            "Teste de prioridade",
            "baixa",
            14
        );

        const chamadoAtualizado = await chamadoService.update_priority(
            chamadoCriado.id,
            "alta"
        );

        expect(chamadoAtualizado).toBeDefined();
        expect(chamadoAtualizado.id).toBe(chamadoCriado.id);
        expect(chamadoAtualizado.prioridade).toBe("alta");

    });


    test("deve excluir um chamado", async () => {

        const chamadoCriado = await chamadoService.create(
            "Chamado para excluir",
            "Chamado que será excluído no teste",
            "baixa",
            14
        );

        const chamadoDeletado = await chamadoService.delete_chamado(
            chamadoCriado.id
        );

        expect(chamadoDeletado).toBeDefined();
        expect(chamadoDeletado.id).toBe(chamadoCriado.id);

    });

});
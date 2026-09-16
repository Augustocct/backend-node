const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "API de Chamados",
            version: "1.0.0",
            description: "Documentação da API de chamados"
        },

        servers: [
            {
                url: "http://localhost:3000"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: [
        path.join(__dirname, "src/routes/chamados.routes.js"),
        path.join(__dirname, "src/routes/login.routes.js")
    ]
};

console.log("ARQUIVO SWAGGER CARREGADO");

const swaggerSpec = swaggerJSDoc(options);

console.log("ROTAS ENCONTRADAS:");
console.log(swaggerSpec.paths);

module.exports = swaggerSpec;
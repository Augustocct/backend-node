const express = require("express");

const roleMiddleware = require("../middleware/role");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

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

router.post("/entrar",
    loginController.entrar
);

router.post("/sair",
    authMiddleware,
    loginController.sair
);

module.exports = router;
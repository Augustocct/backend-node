const express = require("express");

const pool = require("../database/database");

const router = express.Router();

const roleMiddleware = require("../middleware/role");

const authMiddleware = require("../middleware/auth");

const chamadoController = require("../controller/chamado.controller")

router.post(
    "/create",
    authMiddleware,
    chamadoController.create
);

router.get(
    "/list",
     authMiddleware,
     chamadoController.list
); 

router.put(
    "/update/:id",
    authMiddleware,
    chamadoController.update
);

router.put(
    "/update-status/:id", 
    authMiddleware,
    chamadoController.update_status
);

router.put(
    "/update-priority/:id", 
    authMiddleware,
    chamadoController.update_priority
);

router.delete(
    "/delete/:id",
    authMiddleware,
    roleMiddleware("admin"),
    chamadoController.delete_chamado
);

module.exports = router;
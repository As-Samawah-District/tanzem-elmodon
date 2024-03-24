"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const logsController_1 = require("../controllers/logsController");
const router = (0, express_1.Router)();
router.post("/", userControllers_1.protect, logsController_1.getLogs);
exports.default = router;

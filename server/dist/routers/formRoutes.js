"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const formController_1 = require("../controllers/formController");
const multer_1 = __importDefault(require("../utils/multer"));
const router = (0, express_1.Router)();
router.post("/", userControllers_1.protect, multer_1.default.any(), formController_1.addForm);
router.get('/formNumber', formController_1.getFormNumber);
router.get('/forms', userControllers_1.protect, formController_1.getForms);
router.post('/filter', userControllers_1.protect, formController_1.filter);
router.get('/:id', formController_1.getForm);
router.delete('/:id', userControllers_1.protect, formController_1.deleteForm);
router.put('/:id', userControllers_1.protect, formController_1.editForm);
router.post('/download', userControllers_1.protect, formController_1.download);
exports.default = router;

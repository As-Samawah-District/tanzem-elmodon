"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const formModel = new mongoose_1.default.Schema({
    number: String,
    buildingNumber: String,
    userName: String,
}, { timestamps: true });
const Form = mongoose_1.default.model("Form", formModel);
exports.default = Form;

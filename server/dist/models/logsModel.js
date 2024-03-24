"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logsSchema = new mongoose_1.default.Schema({
    type: String,
    user: String,
    details: String,
    system: String,
    ip: String,
}, { timestamps: true });
const Log = mongoose_1.default.model("Log", logsSchema);
exports.default = Log;

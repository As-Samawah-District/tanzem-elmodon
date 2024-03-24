"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = void 0;
const logsModel_1 = __importDefault(require("../models/logsModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.getLogs = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let page = req.query.page || 1;
    let limit = req.query.limit || 1000;
    let start = (page - 1) * limit;
    let end = page * limit;
    console.log(req.body);
    let result = yield logsModel_1.default.find({}).sort({ createdAt: -1 });
    if (req.body.user) {
        result = result.filter((record) => {
            if (record.user.includes(req.body.user)) {
                return record;
            }
        });
    }
    if (req.body.type) {
        result = result.filter((record) => {
            if (record === null || record === void 0 ? void 0 : record.type.includes(req.body.type)) {
                return record;
            }
        });
    }
    if (req.body.from) {
        result = result.filter((record) => {
            let tmp = JSON.stringify(record.createdAt).slice(1, 11);
            let date1 = new Date(tmp).getTime();
            let date2 = new Date(req.body.from).getTime();
            if (date1 >= date2) {
                return record;
            }
        });
    }
    if (req.body.to) {
        result = result.filter((record) => {
            let tmp = JSON.stringify(record.createdAt).slice(1, 11);
            let date1 = new Date(tmp).getTime();
            let date2 = new Date(req.body.to).getTime();
            if (date1 <= date2) {
                return record;
            }
        });
    }
    res.status(200).json({
        status: "success",
        result: result.slice(start, end),
    });
}));

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
exports.protect = exports.getUsers = exports.editUser = exports.deleteUser = exports.signIn = exports.signUp = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("../models/userModel"));
const { promisify } = require("util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const helpers_1 = require("../utils/helpers");
const mongoose_1 = __importDefault(require("mongoose"));
const logsModel_1 = __importDefault(require("../models/logsModel"));
const ip_1 = __importDefault(require("ip"));
const os_1 = __importDefault(require("os"));
exports.signUp = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, role, password, passwordConfirm } = req.body;
    if (password != passwordConfirm)
        return next(new appError_1.default("الرقم السري غير متطابق", 400));
    let check = yield userModel_1.default.findOne({ name });
    if (check) {
        return next(new appError_1.default("اسم المستخدم موجود بالفعل", 400));
    }
    const user = yield userModel_1.default.create({
        name,
        role,
        password,
        passwordConfirm,
    });
    const token = (0, helpers_1.generateToken)({
        id: user._id,
        name: user.name,
        role: user.role,
    });
    yield logsModel_1.default.create({
        type: "اضافه موظف",
        user: req.user.name,
        details: `تسجيل موظف جديد :${name}`,
        system: os_1.default.platform(),
        ip: ip_1.default.address(),
    });
    res.status(201).json({
        status: "success",
        user,
        token,
    });
}));
exports.signIn = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    // validation of the input
    if (!name) {
        return next(new appError_1.default("من فضلك ادخل الاسم", 400));
    }
    if (!password) {
        return next(new appError_1.default("من فضلك ادخل الرقم السري", 400));
    }
    // check if name and password are correct
    const user = yield userModel_1.default.findOne({ name }).select("+password");
    const correct = yield (0, helpers_1.correctPassword)(password, (user === null || user === void 0 ? void 0 : user.password) || "");
    if (!user || !correct) {
        return next(new appError_1.default("الاسم او الرقم السري غير صحيح", 401));
    }
    // return the response
    const token = (0, helpers_1.generateToken)({
        id: user._id,
        name: user.name,
        role: user.role,
    });
    yield logsModel_1.default.create({
        type: "تسجيل دخول",
        user: user.name,
        details: "",
        system: os_1.default.platform(),
        ip: ip_1.default.address(),
    });
    res.status(200).json({
        status: "success",
        token,
        user,
    });
}));
exports.deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new appError_1.default(" مستخدم غير موجود ", 400));
    }
    if (req.user.role != "admin") {
        return next(new appError_1.default("غير مسموح لك بهذا الاجراء", 400));
    }
    let user = yield userModel_1.default.findByIdAndDelete(id);
    yield logsModel_1.default.create({
        type: "حذف",
        user: req.user.name,
        details: `قام ${user === null || user === void 0 ? void 0 : user.name} بحذف المستخدم`,
        system: os_1.default.platform(),
        ip: ip_1.default.address(),
    });
    res.status(200).json({
        status: "success",
    });
}));
exports.editUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { name, password, passwordConfirm, role } = req.body;
    console.log(req.body);
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new appError_1.default("مستخدم غير موجود", 400));
    }
    if (password != passwordConfirm) {
        return next(new appError_1.default('الرقم السري غير متطابق', 400));
    }
    if (req.user.role != "admin") {
        return next(new appError_1.default("غير مسموح لك بهذا الاجراء", 400));
    }
    let user = yield userModel_1.default.findById(req.user.id);
    if (password) {
        password = yield bcrypt_1.default.hash(password, 10);
    }
    user = yield userModel_1.default.findByIdAndUpdate(id, {
        name,
        password,
        role,
    }, {
        new: true,
    });
    if (!user) {
        return next(new appError_1.default("رقم الاستماره غير صحيح", 400));
    }
    // return the response
    const token = (0, helpers_1.generateToken)({
        id: user._id,
        name: user.name,
        role: user.role,
    });
    yield logsModel_1.default.create({
        type: "تعديل بيانات",
        user: user.name,
        details: `قام ${req.user.name} بتعديل البيانات`,
        system: os_1.default.platform(),
        ip: ip_1.default.address(),
    });
    res.status(200).json({
        status: "success",
        token,
    });
}));
exports.getUsers = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role != "admin") {
        return next(new appError_1.default("غير مسموح لك بهذا الاجراء", 400));
    }
    let users = yield userModel_1.default.find();
    res.status(200).json({
        status: "success",
        users
    });
}));
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting token and check of it's there.
    let token = undefined;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new appError_1.default("You are not logged in! please log in to get access", 401));
    }
    // verification token
    const decode = yield promisify(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
    // check if user still exists
    const user = yield userModel_1.default.findById(decode.id);
    if (!user) {
        return next(new appError_1.default("The token belonging to this user does no longer exists", 401));
    }
    // ACCESS TO PROTECTED ROUTE
    req.user = user;
    next();
}));

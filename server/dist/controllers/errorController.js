"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastError = (err) => {
    const message = `Invalid ${err.path}:${err.value}`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFields = (err) => {
    const message = `اسم المستخدم موجود بالفعل`;
    return new appError_1.default(message, 400);
};
const handleValidationError = (err) => {
    const validationErrors = Object.values(err.errors);
    const errors = validationErrors.map((ele) => ele.message);
    const message = `${errors.join(". ")}`;
    return new appError_1.default(message, 400);
};
const handleExpiredTokenError = () => new appError_1.default("Expired token, please login again!", 401);
const handleTokenError = () => new appError_1.default("Invalid token, please login!", 401);
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            status: "error",
            message: err.message || "Something went wrong",
        });
    }
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV == "production") {
        let error = err;
        if (err.name === "CastError")
            error = handleCastError(err);
        if (err.code === 11000)
            error = handleDuplicateFields(err);
        if (err.name === "ValidationError")
            error = handleValidationError(err);
        if (err.name === "JsonWebTokenError")
            error = handleTokenError();
        if (err.name === "TokenExpiredError")
            error = handleExpiredTokenError();
        sendErrorProd(error, res);
    }
    else {
        sendErrorDev(err, res);
    }
};
exports.default = globalErrorHandler;

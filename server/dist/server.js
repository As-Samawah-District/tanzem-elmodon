"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const xss_1 = __importDefault(require("xss"));
const DBConnection_1 = require("./utils/DBConnection");
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const userRoutes_1 = __importDefault(require("./routers/userRoutes"));
const formRoutes_1 = __importDefault(require("./routers/formRoutes"));
const logsRoutes_1 = __importDefault(require("./routers/logsRoutes"));
app.use(express_1.default.json());
//Allow cors for all domains
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
(0, DBConnection_1.conect)();
//Set security http headers
app.use((0, helmet_1.default)());
//Data sanitization against xss attacks
(0, xss_1.default)('<script>alert("xss");</script>');
// global routes
app.use('/api/auth', userRoutes_1.default);
app.use('/api/form', formRoutes_1.default);
app.use('/api/logs', logsRoutes_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(errorController_1.default);
exports.default = app;

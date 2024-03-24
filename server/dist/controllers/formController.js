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
exports.download = exports.filter = exports.getFormNumber = exports.getForms = exports.editForm = exports.deleteForm = exports.getForm = exports.addForm = void 0;
const formModel_1 = __importDefault(require("../models/formModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const mongoose_1 = __importDefault(require("mongoose"));
const logsModel_1 = __importDefault(require("../models/logsModel"));
const ip_1 = __importDefault(require("ip"));
const os_1 = __importDefault(require("os"));
const xlsx_1 = __importDefault(require("xlsx"));
exports.addForm = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) {
        req.file = req.files[0];
        let workbook = xlsx_1.default.read(req.file.buffer);
        let data = [];
        const sheets = workbook.SheetNames;
        for (let i = 0; i < sheets.length; i++) {
            const temp = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);
            temp.forEach((res) => {
                let tmp = {};
                tmp.userName = res["الاسم"];
                tmp.number = res["رقم الاستمارة"];
                tmp.buildingNumber = res["رقم العقار"];
                tmp.classType = res["تاريخ الانشاء"];
                data.push(tmp);
            });
        }
        formModel_1.default.insertMany(data);
        yield logsModel_1.default.create({
            type: "اضافه excel",
            user: req.user.name,
            system: os_1.default.platform(),
            ip: ip_1.default.address(),
        });
        return res.status(200).json({
            status: 'success'
        });
        next();
    }
    const { userName, buildingNumber } = req.body;
    if (!userName) {
        return next(new appError_1.default("من فضلك ادخل الاسم", 400));
    }
    if (!buildingNumber) {
        return next(new appError_1.default("من فضلك ادخل رقم العقار", 400));
    }
    let all = yield formModel_1.default.find().sort({ createdAt: -1 }).limit(1);
    let number = all.length ? all[0].number : 0;
    if (!number)
        number = 1;
    else
        number = Number(number) + 1;
    const form = yield formModel_1.default.create({
        userName,
        number,
        buildingNumber,
    });
    yield logsModel_1.default.create({
        type: "اضافه استماره",
        user: req.user.name,
        details: `أضافة استمارة جديد تحت رقم:${number}`,
        system: os_1.default.platform(),
        ip: ip_1.default.address(),
    });
    res.status(200).json({
        status: "success",
        form,
    });
}));
exports.getForm = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new appError_1.default("رقم الاستماره غير صحيح", 400));
    }
    const form = yield formModel_1.default.findById(id);
    if (!form) {
        return next(new appError_1.default("رقم الاستماره غير صحيح", 400));
    }
    res.status(200).json({
        status: "success",
        form,
    });
}));
exports.deleteForm = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new appError_1.default("رقم الاستماره غير صحيح", 400));
    }
    if (req.user.role != "admin") {
        return next(new appError_1.default("غير مسموح لك بهذا الاجراء", 400));
    }
    const form = yield formModel_1.default.findByIdAndDelete(id);
    if (!form) {
        return next(new appError_1.default("رقم الاستماره غير صحيح", 400));
    }
    yield logsModel_1.default.create({
        type: "حذف",
        user: req.user.name,
        details: `مسح استمارة رقم ${form.number} :`,
        system: os_1.default.platform(),
        ip: ip_1.default.address(),
    });
    res.status(200).json({
        status: "success",
    });
}));
exports.editForm = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userName, buildingNumber } = req.body;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new appError_1.default("رقم الاستماره غير صحيح", 400));
    }
    if (req.user.role != "admin") {
        return next(new appError_1.default("غير مسموح لك بهذا الاجراء", 400));
    }
    const form = yield formModel_1.default.findByIdAndUpdate(id, {
        userName,
        buildingNumber,
    }, {
        new: true,
    });
    if (!form) {
        return next(new appError_1.default("رقم الاستماره غير صحيح", 400));
    }
    yield logsModel_1.default.create({
        type: "تعديل",
        user: req.user.name,
        details: ` تعديل استمارةث رقم:${form.number}`,
        system: os_1.default.platform(),
        ip: ip_1.default.address(),
    });
    res.status(200).json({
        status: "success",
        form,
    });
}));
exports.getForms = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page } = req.query;
    let pageNumber = page ? Number(page) : 1;
    let formsNumber = yield formModel_1.default.countDocuments();
    let forms = yield formModel_1.default.find()
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * 10)
        .limit(10);
    res.status(200).json({
        status: "success",
        forms,
        formsNumber,
    });
}));
exports.getFormNumber = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const formNumber = yield formModel_1.default.countDocuments();
    res.status(200).json({
        status: "success",
        formNumber: formNumber + 1,
    });
}));
exports.filter = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { value } = req.body;
    let forms = yield formModel_1.default.find({
        $or: [
            { userName: { $regex: value } },
            { buildingNumber: { $regex: value } },
            { number: { $regex: value } },
        ],
    })
        .sort({ createdAt: -1 })
        .limit(20);
    res.status(200).json({
        status: "success",
        forms,
    });
}));
exports.download = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.pass || req.body.pass.trim() != process.env.DB_PASS)
        return next(new appError_1.default("الرقم السري غير صحيح", 400));
    if (req.user.role != "admin")
        return next(new appError_1.default("غير مسموح لك بهذا الاجراء", 400));
    const csvData = [["تاريخ الانشاء", "رقم الاستمارة", "رقم العقار", "الاسم"]];
    let data = yield formModel_1.default.find({});
    data.forEach((doc) => {
        let x = [];
        x.push(doc.createdAt);
        x.push(doc.number);
        x.push(doc.buildingNumber);
        x.push(doc.userName);
        csvData.push(x);
    });
    const csvString = csvData.map((row) => row.join(",")).join("\n");
    // Set the appropriate headers
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
    // Send the CSV data as the response body
    res.send(csvString);
}));

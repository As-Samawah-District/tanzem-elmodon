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
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "من فضلك ادخل الاسم"],
        maxLength: 40,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, "من فضلك ادخل الرقم السري"],
        maxLength: 50,
        minLenght: 5,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "من فضلك أكد الرقم السري"],
        validate: {
            validator: function (el) {
                return el == this.password;
            },
            message: "الرقم السري غير متطابق",
        },
    },
}, { timestamps: true });
userModel.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // Only run this function if password was modified
        if (!user.isModified("password"))
            return next();
        // Hash the password with cost of 12
        user.password = yield bcrypt_1.default.hash(user.password, 12);
        user.passwordConfirm = undefined;
        next();
    });
});
const User = mongoose_1.default.model("User", userModel);
exports.default = User;

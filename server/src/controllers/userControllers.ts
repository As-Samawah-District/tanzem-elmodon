import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
const { promisify } = require("util");
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { generateToken, correctPassword, hashPassword } from "../utils/helpers";
import mongoose from "mongoose";
import Log from "../models/logsModel";
import IP from "ip";
import os from "os";
export const signUp = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { name, role, password, passwordConfirm } = req.body;
  if (password != passwordConfirm) return next(new AppError("الرقم السري غير متطابق", 400));
  let check = await User.findOne({ name });
  if (check) {
    return next(new AppError("اسم المستخدم موجود بالفعل", 400));
  }
  const user = await User.create({
    name,
    role,
    password,
    passwordConfirm,
  });
  const token: string = generateToken({
    id: user._id,
    name: user.name,
    role: user.role,
  });
  await Log.create({
    type: "اضافه موظف",
    user: req.user.name,
    details: `تسجيل موظف جديد :${name}`,
    system: os.platform(),
    ip: IP.address(),
  });
  res.status(201).json({
    status: "success",
    user,
    token,
  });
});

export const createAdmin = async () => {
  let check = await User.findOne({ name: "admin" });
  if (check) {
    console.log("admin already exists");
  }
  const user = await User.create({
    name: "admin",
    role: "admin",
    password: "Qw123456@@",
    passwordConfirm: "Qw123456@@",
  });
  const token: string = generateToken({
    id: user._id,
    name: user.name,
    role: user.role,
  });
  console.log("admin created");
};

export const signIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, password } = req.body;
  // validation of the input
  if (!name) {
    return next(new AppError("من فضلك ادخل الاسم", 400));
  }
  if (!password) {
    return next(new AppError("من فضلك ادخل الرقم السري", 400));
  }

  // check if name and password are correct
  const user = await User.findOne({ name }).select("+password");
  const correct: Boolean = await correctPassword(password, user?.password || "");
  if (!user || !correct) {
    return next(new AppError("الاسم او الرقم السري غير صحيح", 401));
  }

  // return the response
  const token = generateToken({
    id: user._id,
    name: user.name,
    role: user.role,
  });
  await Log.create({
    type: "تسجيل دخول",
    user: user.name,
    details: "",
    system: os.platform(),
    ip: IP.address(),
  });
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});
export const deleteUser = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(" مستخدم غير موجود ", 400));
  }
  if (req.user.role != "admin") {
    return next(new AppError("غير مسموح لك بهذا الاجراء", 400));
  }
  let user = await User.findByIdAndDelete(id);
  await Log.create({
    type: "حذف",
    user: req.user.name,
    details: `قام ${user?.name} بحذف المستخدم`,
    system: os.platform(),
    ip: IP.address(),
  });
  res.status(200).json({
    status: "success",
  });
});
export const editUser = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  let { name, password, passwordConfirm, role } = req.body;
  console.log(req.body);
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("مستخدم غير موجود", 400));
  }
  if (password != passwordConfirm) {
    return next(new AppError("الرقم السري غير متطابق", 400));
  }
  if (req.user.role != "admin") {
    return next(new AppError("غير مسموح لك بهذا الاجراء", 400));
  }
  let user = await User.findById(req.user.id);
  if (password) {
    password = await bcrypt.hash(password, 10);
  }
  user = await User.findByIdAndUpdate(
    id,
    {
      name,
      password,
      role,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new AppError("رقم الاستماره غير صحيح", 400));
  }
  // return the response
  const token = generateToken({
    id: user._id,
    name: user.name,
    role: user.role,
  });
  await Log.create({
    type: "تعديل بيانات",
    user: user.name,
    details: `قام ${req.user.name} بتعديل البيانات`,
    system: os.platform(),
    ip: IP.address(),
  });
  res.status(200).json({
    status: "success",
    token,
  });
});
export const getUsers = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  if (req.user.role != "admin") {
    return next(new AppError("غير مسموح لك بهذا الاجراء", 400));
  }
  let users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
});
export const protect = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  // Getting token and check of it's there.
  let token: string | undefined = undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in! please log in to get access", 401));
  }

  // verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const user = await User.findById(decode.id);
  if (!user) {
    return next(new AppError("The token belonging to this user does no longer exists", 401));
  }

  // ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

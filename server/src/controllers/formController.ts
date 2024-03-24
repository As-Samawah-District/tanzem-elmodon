import { NextFunction, Request, Response } from "express";
import Form from "../models/formModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import mongoose from "mongoose";
import Log from "../models/logsModel";
import IP from "ip";
import os from "os";
import XLS from "xlsx";
export const addForm = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {

    if(req.files?.length){
      req.file = req.files[0];
      let workbook = XLS.read(req.file.buffer);
      let data = [];

      const sheets = workbook.SheetNames;

      for (let i = 0; i < sheets.length; i++) {
        const temp = XLS.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[i]]
        );
        temp.forEach((res) => {
          let tmp:any = {};
          tmp.userName = res["الاسم"];
          tmp.number = res["رقم الاستمارة"];
          tmp.buildingNumber = res["رقم العقار"];
          tmp.classType = res["تاريخ الانشاء"];
          data.push(tmp);
        });
      }
      Form.insertMany(data);
      await Log.create({
        type: "اضافه excel",
        user: req.user.name,
        system: os.platform(),
        ip: IP.address(),
      });
      return res.status(200).json({
        status:'success'
      });
      next();
    }
    const { userName, buildingNumber } = req.body;
    if (!userName) {
      return next(new AppError("من فضلك ادخل الاسم", 400));
    }
    if (!buildingNumber) {
      return next(new AppError("من فضلك ادخل رقم العقار", 400));
    }
    let all = await Form.find().sort({ createdAt: -1 }).limit(1);
    let number = all.length ? all[0].number : 0;
    if (!number) number = 1;
    else number = Number(number) + 1;
    const form = await Form.create({
      userName,
      number,
      buildingNumber,
    });
    
    await Log.create({
      type: "اضافه استماره",
      user: req.user.name,
      details: `أضافة استمارة جديد تحت رقم:${number}`,
      system: os.platform(),
      ip: IP.address(),
    });
    
    res.status(200).json({
      status: "success",
      form,
    });
  }
);

export const getForm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("رقم الاستماره غير صحيح", 400));
    }
    const form = await Form.findById(id);
    if (!form) {
      return next(new AppError("رقم الاستماره غير صحيح", 400));
    }
    res.status(200).json({
      status: "success",
      form,
    });
  }
);

export const deleteForm = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("رقم الاستماره غير صحيح", 400));
    }
    if (req.user.role != "admin") {
      return next(new AppError("غير مسموح لك بهذا الاجراء", 400));
    }
    const form = await Form.findByIdAndDelete(id);
    if (!form) {
      return next(new AppError("رقم الاستماره غير صحيح", 400));
    }
    await Log.create({
      type: "حذف",
      user: req.user.name,
      details: `مسح استمارة رقم ${form.number} :`,
      system: os.platform(),
      ip: IP.address(),
    });
    res.status(200).json({
      status: "success",
    });
  }
);

export const editForm = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userName, buildingNumber } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("رقم الاستماره غير صحيح", 400));
    }
    if (req.user.role != "admin") {
      return next(new AppError("غير مسموح لك بهذا الاجراء", 400));
    }
    const form = await Form.findByIdAndUpdate(
      id,
      {
        userName,
        buildingNumber,
      },
      {
        new: true,
      }
    );
    if (!form) {
      return next(new AppError("رقم الاستماره غير صحيح", 400));
    }
    await Log.create({
      type: "تعديل",
      user: req.user.name,
      details: ` تعديل استمارةث رقم:${form.number}`,
      system: os.platform(),
      ip: IP.address(),
    });
    res.status(200).json({
      status: "success",
      form,
    });
  }
);

export const getForms = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { page } = req.query;
    let pageNumber = page ? Number(page) : 1;
    let formsNumber = await Form.countDocuments();
    let forms = await Form.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * 10)
      .limit(10);
    res.status(200).json({
      status: "success",
      forms,
      formsNumber,
    });
  }
);

export const getFormNumber = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const formNumber = await Form.countDocuments();
    res.status(200).json({
      status: "success",
      formNumber: formNumber + 1,
    });
  }
);
export const filter = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { value } = req.body;
    let forms = await Form.find({
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
  }
);

export const download = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    if (!req.body.pass || req.body.pass.trim() != process.env.DB_PASS)
      return next(new AppError("الرقم السري غير صحيح", 400));
    if (req.user.role != "admin")
      return next(new AppError("غير مسموح لك بهذا الاجراء", 400));
    const csvData = [["تاريخ الانشاء", "رقم الاستمارة", "رقم العقار", "الاسم"]];
    let data = await Form.find({});

    data.forEach((doc: any) => {
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
  }
);

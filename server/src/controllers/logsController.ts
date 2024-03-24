import { NextFunction, Response } from "express";
import Log from "../models/logsModel";
import catchAsync from "../utils/catchAsync";

export const getLogs = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 1000;
    let start = (page - 1) * limit;
    let end = page * limit;
    console.log(req.body);
    let result = await Log.find({}).sort({ createdAt: -1 });
    if (req.body.user) {
      result = result.filter((record) => {
        if (record.user.includes(req.body.user)) {
          return record;
        }
      });
    }
    if (req.body.type) {
      result = result.filter((record) => {
        if (record?.type.includes(req.body.type)) {
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
  }
);

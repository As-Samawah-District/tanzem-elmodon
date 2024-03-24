import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

interface ErrorResponse {
  statusCode: number;
  status: string;
  message: string;
  stack?: string;
  isOperational?: boolean;
}

interface MongooseValidationError {
  message: string;
  name: string;
  properties: {
    message: string;
    type: string;
    path: string;
  };
  kind: string;
  path: string;
  value: any;
}

const handleCastError = (err: any): AppError => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err: any): AppError => {
  const message = `اسم المستخدم موجود بالفعل`;

  return new AppError(message, 400);
};

const handleValidationError = (err: any): AppError => {
  const validationErrors: MongooseValidationError[] = Object.values(
    err.errors
  ) as MongooseValidationError[];
  const errors = validationErrors.map((ele) => ele.message);

  const message = `${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleExpiredTokenError = (): AppError =>
  new AppError("Expired token, please login again!", 401);

const handleTokenError = () =>
  new AppError("Invalid token, please login!", 401);
const sendErrorDev = (err: any, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong",
    });
  }
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV == "production") {
    let error = err;
    if (err.name === "CastError") error = handleCastError(err);
    if (err.code === 11000) error = handleDuplicateFields(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.name === "JsonWebTokenError") error = handleTokenError();
    if (err.name === "TokenExpiredError") error = handleExpiredTokenError();
    sendErrorProd(error, res);
  } else {
    sendErrorDev(err, res);
  }
};

export default globalErrorHandler;

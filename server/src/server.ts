import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import cors from "cors";
import helmet from "helmet";
import xss from "xss";
import {conect} from './utils/DBConnection'
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import userRoutes from './routers/userRoutes'
import formRoutes from './routers/formRoutes'
import logsRoutes from './routers/logsRoutes'
app.use(express.json());

//Allow cors for all domains
app.use(
  cors({
    origin: "*",
    credentials: true,
  }) as any
);

conect()

//Set security http headers
app.use(helmet());

//Data sanitization against xss attacks
xss('<script>alert("xss");</script>');

// global routes
app.use('/api/auth',userRoutes);
app.use('/api/form',formRoutes);
app.use('/api/logs',logsRoutes )
app.all("*", (req: any, res: any, next: any) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
});
app.use(globalErrorHandler);


export default app;

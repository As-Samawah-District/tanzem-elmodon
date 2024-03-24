import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { hash, compare } from "bcrypt";
export const generateToken = (data: Object): string => {
  const token: string = jwt.sign(data, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
export const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

export const correctPassword = async (
  candidatePassword: string,
  userPassword: string
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

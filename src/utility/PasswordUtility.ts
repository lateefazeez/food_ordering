import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET_KEY } from "../config";
import { Request } from "express";
import { AuthPayload } from "../dto/Auth.dto";

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generateHashedPassword = async (
  password: string,
  salt: string
) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  const hashedPassword = await generateHashedPassword(enteredPassword, salt);
  return savedPassword === hashedPassword;
};

export const generateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET_KEY!, {
    expiresIn: "1d",
  });
};

export const validateSignature = (req: Request) => {
  const signature = req.get("Authorization");

  if (signature) {
    try {
      const payload = jwt.verify(
        signature.split(" ")[1],
        APP_SECRET_KEY!
      ) as AuthPayload;
      req.user = payload;
      return true;
    } catch (error) {
      return false;
    }
  }

  return false;
};

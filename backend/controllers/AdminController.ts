import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto/Vendor.dto";
import { Vendor } from "../models";
import { generateHashedPassword, generateSalt } from "../utility";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    foodType,
    address,
    pinCode,
    phone,
    email,
    password,
  } = <CreateVendorInput>req.body;

  const existingVendor = await Vendor.findOne({ email: email, phone: phone });

  if (existingVendor) {
    return res.json({
      staus: res.status,
      message: "A Vendor already exists with this email or phone number",
    });
  }

  // generate a salt
  const salt = await generateSalt();

  // hash the password along with our new salt
  const userPassword = await generateHashedPassword(password, salt);

  const createdVendor = await Vendor.create({
    name: name,
    ownerName: ownerName,
    foodType: foodType,
    address: address,
    pinCode: pinCode,
    phone: phone,
    email: email,
    password: userPassword,
    salt: salt,
    serviceAvailable: false,
    rating: 0,
    coverImages: [],
  });

  return res.json({
    staus: res.status,
    message: "Vendor created successfully",
    data: createdVendor,
  });
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const DeleteVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

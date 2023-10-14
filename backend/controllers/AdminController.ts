import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto/Vendor.dto";
import { Vendor } from "../models";
import { generateHashedPassword, generateSalt } from "../utility";

export const findVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  }

  return await Vendor.findById(id);
};

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

  const existingVendor = await findVendor("", email);

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
    foods: [],
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
) => {
  const vendors = await Vendor.find();

  if (vendors !== null) {
    return res.json({
      status: res.status,
      message: "Vendors retrieved successfully",
      data: vendors,
    });
  }

  return res.json({
    status: res.status,
    message: "No Vendors found",
    data: [],
  });
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.id;
  if (vendorId !== null || vendorId !== undefined) {
    const vendor = await findVendor(vendorId);
    return res.json({
      status: res.status,
      message: "Vendor retrieved successfully",
      data: vendor,
    });
  }

  return res.json({
    status: res.status,
    message: "No Vendor found",
    data: {},
  });
};

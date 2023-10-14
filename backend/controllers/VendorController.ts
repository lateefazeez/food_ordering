import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { Vendor } from "../models";
import { findVendor } from "./AdminController";
import { generateSignature, validatePassword } from "../utility";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;

  const existingVendor = await findVendor("", email);

  if (existingVendor) {
    // check if the password is valid
    const validPassword = await validatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );

    if (validPassword) {
      const signature = generateSignature({
        _id: existingVendor._id,
        email: existingVendor.email,
        name: existingVendor.name,
        foodTypes: existingVendor.foodType,
      });

      return res.json({
        status: res.status,
        message: "Vendor Logged In",
        token: signature,
      });
    }

    return res.json({
      status: res.status,
      message: "Invalid Password",
    });
  }
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await findVendor(user._id);

    return res.json({
      status: res.status,
      message: "Vendor Profile",
      data: existingVendor,
    });
  }

  return res.json({
    status: res.status,
    message: "User not authorized",
  });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, foodType, address, phone } = <EditVendorInput>req.body;

  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor) {
      existingVendor.name = name;
      existingVendor.foodType = foodType;
      existingVendor.address = address;
      existingVendor.phone = phone;

      const updatedVendor = await existingVendor.save();

      return res.json({
        status: res.status,
        message: "Vendor Profile Updated Successfuly",
        data: updatedVendor,
      });
    }
  }

  return res.json({
    status: res.status,
    message: "User not authorized",
  });
};

export const UpdateVendorServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

      const updatedVendor = await existingVendor.save();

      return res.json({
        status: res.status,
        message: "Vendor Service Updated Successfuly",
        data: updatedVendor,
      });
    }
  }

  return res.json({
    status: res.status,
    message: "User not authorized",
  });
};

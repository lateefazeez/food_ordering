import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto/Vendor.dto";
import { DeliveryDriver, Vendor } from "../models";
import { generateHashedPassword, generateSalt } from "../utility";
import { Transaction } from "../models/Transaction";

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
    lat: 0,
    long: 0,
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

/** -------------------------------Transaction---------------------------------- */
export const GetTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.id;

  const vendor = await findVendor(vendorId);

  const transactions = await Transaction.find();

  if (transactions) {
    return res.status(200).json({
      message: "Transactions fetched successfully",
      data: transactions,
    });
  }

  return res.status(404).json({
    message: "No transactions available",
    data: [],
  });
};

export const GetTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transactionId = req.params.id;

  const transaction = await Transaction.findById(transactionId);

  if (transaction) {
    return res.status(200).json({
      message: "Transaction fetched successfully",
      data: transaction,
    });
  }

  return res.status(404).json({
    message: "No transaction found",
    data: {},
  });
};

export const VerifyDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id, verified } = req.body;

  if (_id) {
    const profile = await DeliveryDriver.findById(_id);

    if (profile) {
      profile.verified = verified;
      const result = await profile.save();
      return res.status(200).json(result);
    }
  }

  return res.status(400).json({ message: "User Profile cannot be updated" });
};

export const GetDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const drivers = await DeliveryDriver.find();

  if (drivers) {
    return res.status(200).json({
      message: "Drivers fetched successfully",
      data: drivers,
    });
  }

  return res.status(404).json({
    message: "No drivers available",
    data: [],
  });
};

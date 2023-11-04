import { plainToClass } from "class-transformer";
import express, { Request, Response, NextFunction } from "express";
import {
  CartItem,
  CreateCustomerInputs,
  CreateDeliveryDriverInputs,
  EditCustomerProfileInputs,
  OrderInputs,
  UserLoginInputs,
} from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  generateHashedPassword,
  generateOTP,
  generateSalt,
  generateSignature,
  onRequestOTP,
  validatePassword,
} from "../utility";
import { Customer } from "../models/Customer";
import { DeliveryDriver, Food, Vendor } from "../models";
import { Order } from "../models/Order";
import { Offer } from "../models/Offer";
import { Transaction } from "../models/Transaction";

export const DeliveryDriverSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryDriverInputs = plainToClass(
    CreateDeliveryDriverInputs,
    req.body
  );
  const inputErrors = await validate(deliveryDriverInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password, address, firstName, lastName, pincode } =
    deliveryDriverInputs;
  const salt = await generateSalt();
  const userPassword = await generateHashedPassword(password, salt);

  const existingDriver = await DeliveryDriver.findOne({ email: email });
  if (existingDriver !== null) {
    return res
      .status(409)
      .json({ message: "A user exists with the provided email!" });
  }

  const result = await DeliveryDriver.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    firstName: firstName,
    lastName: lastName,
    verified: false,
    lat: 0,
    long: 0,
    address: address,
    isAvailable: false,
    pincode: pincode,
  });

  if (result) {
    // generate the signature
    const signature = generateSignature({
      _id: result.id,
      email: result.email,
      verified: result.verified,
    });

    // send the result to client
    return res.status(200).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }

  return res.status(400).json({ message: "Error with Signup" });
};

export const DeliveryDriverLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }

  const { email, password } = loginInputs;

  const deliveryDriver = await DeliveryDriver.findOne({ email: email });

  if (deliveryDriver) {
    const validation = await validatePassword(
      password,
      deliveryDriver.password,
      deliveryDriver.salt
    );

    if (validation) {
      // generate the signature
      const signature = generateSignature({
        _id: deliveryDriver.id,
        email: deliveryDriver.email,
        verified: deliveryDriver.verified,
      });

      // send the result to client
      return res.status(200).json({
        signature: signature,
        verified: deliveryDriver.verified,
        email: deliveryDriver.email,
      });
    }
  }

  return res.status(400).json({ message: "Login Error" });
};

export const GetDeliveryDriverProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const driver = req.user;
  if (driver) {
    const profile = await DeliveryDriver.findById(driver._id);
    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ message: "User Profile not available" });
};

export const UpdateDeliveryDriverProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const driver = req.user;
  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });
  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }
  const { firstName, lastName, address } = profileInputs;
  if (driver) {
    const profile = await Customer.findById(driver._id);
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();
      return res.status(200).json(result);
    }
  }
  return res.status(400).json({ message: "User Profile cannot be updated" });
};

export const UpdateDeliveryStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const driver = req.user;

  if (driver) {
    const { lat, long } = req.body;
    const profile = await DeliveryDriver.findById(driver._id);
    if (profile) {
      profile.lat = lat;
      profile.long = long;
      profile.isAvailable = !profile.isAvailable;
      const result = await profile.save();
      return res.status(200).json(result);
    }
  }

  return res.status(400).json({ message: "User Profile cannot be updated" });
};

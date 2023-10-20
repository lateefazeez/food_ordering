import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { Food, Vendor } from "../models";
import { findVendor } from "./AdminController";
import { generateSignature, validatePassword } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import { Order } from "../models/Order";

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

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor) {
      const files = req.files as Express.Multer.File[];
      const images = files.map((f) => f.filename);

      existingVendor.coverImages.push(...images);
      const updatedVendor = await existingVendor.save();

      return res.json({
        status: res.status,
        message: "Vendor Cover Image Uploaded Successfuly",
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

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { name, description, price, foodType, readyTime, category } = <
      CreateFoodInput
    >req.body;

    const existingVendor = await findVendor(user._id);
    if (existingVendor) {
      const file = req.files as Express.Multer.File[];

      const images = file.map((f) => f.filename);

      const createdFood = await Food.create({
        name: name,
        description: description,
        category: category,
        price: price,
        vendorId: existingVendor._id,
        foodType: foodType,
        readyTime: readyTime,
        images: images,
      });

      existingVendor.foods.push(createdFood);
      existingVendor.save();

      return res.json({
        status: res.status,
        message: `${createdFood.name} added successfully`,
        data: createdFood,
      });
    }
  }
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods) {
      return res.json({
        status: res.status,
        message: "Foods retrieved successfully",
        data: foods,
      });
    }
  }

  return res.json({
    status: res.status,
    message: "User not authorized",
  });
};

/** ---------------------------------- Orders -------------------------------------- **/

export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  console.log("User: ", user);

  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );
    if (orders) {
      return res.status(200).json(orders);
    }
  }

  return res.status(401).json({ message: "Order not found" });
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  const { status, remarks, time } = req.body; // Accept, Reject, Ready, Delivered, Cancelled, Preparing

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    if (order) {
      order.orderStatus = status;
      order.remarks = remarks;

      if (time) {
        order.readyTime = time;
      }

      const updatedOrder = await order.save();

      if (updatedOrder) return res.status(200).json(updatedOrder);
    }
  }

  return res.status(401).json({ message: "Unable to process order" });
};

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    if (order) {
      return res.status(200).json(order);
    }
  }

  return res.status(401).json({ message: "Order not found" });
};

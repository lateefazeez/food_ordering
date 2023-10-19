import express, { Request, Response, NextFunction } from "express";
import {
  CreateOrder,
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
  RequestOtp,
  UpdateCustomerProfile,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

/** ---------------------------------- Signup / Create Customer -------------------------------------- **/
router.post("/signup", CustomerSignup);

/** ---------------------------------- Login -------------------------------------- **/
router.post("/login", CustomerLogin);

// Authentication Middleware
router.use(authenticate);

/** ---------------------------------- Verify Customer Account -------------------------------------- **/
router.patch("/verify", CustomerVerify);

/** ---------------------------------- OTP / Requesting OTP -------------------------------------- **/
router.get("/otp", RequestOtp);

/** ---------------------------------- Profile -------------------------------------- **/
router.get("/profile", GetCustomerProfile);

router.patch("/profile", UpdateCustomerProfile);

// Cart
// Payment

// Order
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderById);

export { router as customerRoute };

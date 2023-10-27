import express, { Request, Response, NextFunction } from "express";
import {
  AddtoCart,
  CreateOrder,
  CreatePayment,
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  DeleteCart,
  GetCart,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
  RequestOtp,
  UpdateCustomerProfile,
  VerifyOffer,
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

/** ---------------------------------- Cart -------------------------------------- **/
router.post("/cart", AddtoCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);

/** ---------------------------------- Payment -------------------------------------- **/
router.post("/create-payment", CreatePayment);

/** ---------------------------------- Orders -------------------------------------- **/
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderById);

/** ---------------------------------- Offers -------------------------------------- **/
router.get("/offer/verify/:id", VerifyOffer);

export { router as customerRoute };

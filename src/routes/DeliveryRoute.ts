import express, { Request, Response, NextFunction } from "express";
import {
  AddtoCart,
  CreateOrder,
  CreatePayment,
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  DeleteCart,
  DeliveryDriverLogin,
  DeliveryDriverSignup,
  GetCart,
  GetCustomerProfile,
  GetDeliveryDriverProfile,
  GetOrderById,
  GetOrders,
  RequestOtp,
  UpdateCustomerProfile,
  UpdateDeliveryDriverProfile,
  UpdateDeliveryStatus,
  VerifyOffer,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

/** ---------------------------------- Signup / Create Customer -------------------------------------- **/
router.post("/signup", DeliveryDriverSignup);

/** ---------------------------------- Login -------------------------------------- **/
router.post("/login", DeliveryDriverLogin);

// Authentication Middleware
router.use(authenticate);

/** ---------------------------------- Profile -------------------------------------- **/
router.get("/profile", GetDeliveryDriverProfile);

router.patch("/profile", UpdateDeliveryDriverProfile);

export { router as DeliveryRoute };

/** -----------------------------------Service Status --------------------------------- */
router.post("/service-status", UpdateDeliveryStatus);

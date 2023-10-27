import express, { Request, Response, NextFunction } from "express";
import {
  CreateVendor,
  GetDrivers,
  GetTransactionById,
  GetTransactions,
  GetVendorByID,
  GetVendors,
  VerifyDriver,
} from "../controllers";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Admin Route" });
});

router.post("/vendor", CreateVendor);

router.get("/vendors", GetVendors);

router.get("/vendor/:id", GetVendorByID);

router.get("/transactions", GetTransactions);

router.get("/transaction/:id", GetTransactionById);

router.post("/delivery/verify", VerifyDriver);

router.get("/delivery/drivers", GetDrivers);

export { router as adminRoute };

import express, { Request, Response, NextFunction } from "express";
import { CreateVendor, GetVendorByID, GetVendors } from "../controllers";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Admin Route" });
});

router.post("/vendor", CreateVendor);

router.get("/vendors", GetVendors);

router.get("/vendor/:id", GetVendorByID);

export { router as adminRoute };

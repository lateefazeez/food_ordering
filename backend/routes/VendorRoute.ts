import express, { Request, Response, NextFunction } from "express";
import {
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorServices,
  VendorLogin,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

router.post("/login", VendorLogin);

router.use(authenticate);

router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/services", UpdateVendorServices);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Vendor Route" });
});

export { router as vendorRoute };

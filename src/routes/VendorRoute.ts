import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import {
  AddFood,
  AddOffer,
  GetCurrentOrders,
  GetFoods,
  GetOffers,
  GetOrderDetails,
  GetVendorProfile,
  ProcessOrder,
  UpdateOffer,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorServices,
  VendorLogin,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/vendor");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", VendorLogin);

router.use(authenticate);

router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/coverimage", images, UpdateVendorCoverImage);
router.patch("/services", UpdateVendorServices);

router.post("/food", images, AddFood);
router.get("/foods", GetFoods);
router.get("/food/:id");

/** ---------------------------------- Orders -------------------------------------- **/
router.get("/orders", GetCurrentOrders);
router.put("/order/:id/process", ProcessOrder);
router.get("/order/:id", GetOrderDetails);

/** ---------------------------------- Offers -------------------------------------- **/
router.get("/offers", GetOffers);
router.post("/offers", AddOffer);
router.put("/offers/:id", UpdateOffer);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Vendor Route" });
});

export { router as vendorRoute };

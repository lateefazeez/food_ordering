import express, { Request, Response, NextFunction } from "express";
import {
  GetFoodAvailability,
  GetFoodsAvailableIn30,
  GetRestaurantById,
  GetTopRestaurants,
  GetVendorOffers,
  SearchFoods,
} from "../controllers";

const router = express.Router();

/** ---------------------------------- Food Availability -------------------------------------- **/
router.get("/:pincode", GetFoodAvailability);

/** ---------------------------------- Top Restaurants -------------------------------------- **/
router.get("/top-restaurants/:pincode", GetTopRestaurants);

/** ---------------------------------- Foods Available in 30 mins -------------------------------------- **/
router.get("/foods-available-in-30/:pincode", GetFoodsAvailableIn30);

/** ---------------------------------- Search Foods -------------------------------------- **/
router.get("/search/:pincode", SearchFoods);

/** ---------------------------------- Find Restaurants by ID -------------------------------------- **/
router.get("/restaurant/:id", GetRestaurantById);

/** ---------------------------------- Find Offers -------------------------------------- **/
router.get("/offers/:pincode", GetVendorOffers);

export { router as shoppingRoute };

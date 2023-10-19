import express, { Request, Response, NextFunction } from "express";
import { FoodDoc, Vendor } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pinCode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length > 0) {
    res.status(200).json({
      message: "Foods fetched successfully",
      data: result,
    });
  }

  return res.status(404).json({
    message: "No foods available",
    data: [],
  });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pinCode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result.length > 0) {
    res.status(200).json({
      message: "Top Restaurants fetched successfully",
      data: result,
    });
  }
};

export const GetFoodsAvailableIn30 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pinCode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length > 0) {
    const foodResult: any = [];

    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      const filteredFoods = foods.filter((food) => food.readyTime <= 30);
      if (filteredFoods.length > 0) {
        foodResult.push({
          ...vendor,
          foods: filteredFoods,
        });
      }
    });

    if (foodResult.length > 0) {
      return res.status(200).json({
        message: "Foods fetched successfully",
        data: foodResult,
      });
    }
  }

  return res.status(404).json({
    message: "No foods available",
    data: [],
  });
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const query = req.query.q as string;

  const result = await Vendor.find({
    pinCode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length > 0) {
    const foodResult: any = [];

    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      const filteredFoods = foods.filter((food) =>
        food.name.toLowerCase().includes(query?.toLowerCase())
      );
      if (filteredFoods.length > 0) {
        foodResult.push({
          ...vendor,
          foods: filteredFoods,
        });
      }
    });

    if (foodResult.length > 0) {
      return res.status(200).json({
        message: "Foods fetched successfully",
        data: foodResult,
      });
    }
  }

  return res.status(404).json({
    message: "No foods available",
    data: [],
  });
};

export const GetRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const result = await Vendor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json({
      message: "Restaurant fetched successfully",
      data: result,
    });
  }

  return res.status(404).json({
    message: "No restaurant found",
    data: {},
  });
};

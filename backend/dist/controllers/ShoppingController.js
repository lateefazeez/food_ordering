"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRestaurantById = exports.SearchFoods = exports.GetFoodsAvailableIn30 = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({
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
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({
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
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodsAvailableIn30 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({
        pinCode: pincode,
        serviceAvailable: true,
    })
        .sort([["rating", "descending"]])
        .populate("foods");
    if (result.length > 0) {
        const foodResult = [];
        result.map((vendor) => {
            const foods = vendor.foods;
            const filteredFoods = foods.filter((food) => food.readyTime <= 30);
            if (filteredFoods.length > 0) {
                foodResult.push(Object.assign(Object.assign({}, vendor), { foods: filteredFoods }));
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
});
exports.GetFoodsAvailableIn30 = GetFoodsAvailableIn30;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const query = req.query.q;
    const result = yield models_1.Vendor.find({
        pinCode: pincode,
        serviceAvailable: true,
    })
        .sort([["rating", "descending"]])
        .populate("foods");
    if (result.length > 0) {
        const foodResult = [];
        result.map((vendor) => {
            const foods = vendor.foods;
            const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(query === null || query === void 0 ? void 0 : query.toLowerCase()));
            if (filteredFoods.length > 0) {
                foodResult.push(Object.assign(Object.assign({}, vendor), { foods: filteredFoods }));
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
});
exports.SearchFoods = SearchFoods;
const GetRestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield models_1.Vendor.findById(id).populate("foods");
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
});
exports.GetRestaurantById = GetRestaurantById;
//# sourceMappingURL=ShoppingController.js.map
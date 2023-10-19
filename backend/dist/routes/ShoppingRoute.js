"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.shoppingRoute = router;
/** ---------------------------------- Food Availability -------------------------------------- **/
router.get("/:pincode", controllers_1.GetFoodAvailability);
/** ---------------------------------- Top Restaurants -------------------------------------- **/
router.get("/top-restaurants/:pincode", controllers_1.GetTopRestaurants);
/** ---------------------------------- Foods Available in 30 mins -------------------------------------- **/
router.get("/foods-available-in-30/:pincode", controllers_1.GetFoodsAvailableIn30);
/** ---------------------------------- Search Foods -------------------------------------- **/
router.get("/search/:pincode", controllers_1.SearchFoods);
/** ---------------------------------- Find Restaurants by ID -------------------------------------- **/
router.get("/restaurant/:id", controllers_1.GetRestaurantById);
//# sourceMappingURL=ShoppingRoute.js.map
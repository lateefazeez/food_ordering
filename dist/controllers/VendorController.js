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
exports.GetFoods = exports.AddFood = exports.UpdateVendorServices = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const models_1 = require("../models");
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminController_1.findVendor)("", email);
    if (existingVendor) {
        // check if the password is valid
        const validPassword = yield (0, utility_1.validatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validPassword) {
            const signature = (0, utility_1.generateSignature)({
                _id: existingVendor._id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodTypes: existingVendor.foodType,
            });
            return res.json({
                status: res.status,
                message: "Vendor Logged In",
                token: signature,
            });
        }
        return res.json({
            status: res.status,
            message: "Invalid Password",
        });
    }
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        return res.json({
            status: res.status,
            message: "Vendor Profile",
            data: existingVendor,
        });
    }
    return res.json({
        status: res.status,
        message: "User not authorized",
    });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, foodType, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        if (existingVendor) {
            existingVendor.name = name;
            existingVendor.foodType = foodType;
            existingVendor.address = address;
            existingVendor.phone = phone;
            const updatedVendor = yield existingVendor.save();
            return res.json({
                status: res.status,
                message: "Vendor Profile Updated Successfuly",
                data: updatedVendor,
            });
        }
    }
    return res.json({
        status: res.status,
        message: "User not authorized",
    });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        if (existingVendor) {
            const files = req.files;
            const images = files.map((f) => f.filename);
            existingVendor.coverImages.push(...images);
            const updatedVendor = yield existingVendor.save();
            return res.json({
                status: res.status,
                message: "Vendor Cover Image Uploaded Successfuly",
                data: updatedVendor,
            });
        }
    }
    return res.json({
        status: res.status,
        message: "User not authorized",
    });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const UpdateVendorServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        if (existingVendor) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const updatedVendor = yield existingVendor.save();
            return res.json({
                status: res.status,
                message: "Vendor Service Updated Successfuly",
                data: updatedVendor,
            });
        }
    }
    return res.json({
        status: res.status,
        message: "User not authorized",
    });
});
exports.UpdateVendorServices = UpdateVendorServices;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, price, foodType, readyTime, category } = req.body;
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        if (existingVendor) {
            const file = req.files;
            const images = file.map((f) => f.filename);
            const createdFood = yield models_1.Food.create({
                name: name,
                description: description,
                category: category,
                price: price,
                vendorId: existingVendor._id,
                foodType: foodType,
                readyTime: readyTime,
                images: images,
            });
            existingVendor.foods.push(createdFood);
            existingVendor.save();
            return res.json({
                status: res.status,
                message: `${createdFood.name} added successfully`,
                data: createdFood,
            });
        }
    }
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vendorId: user._id });
        if (foods) {
            return res.json({
                status: res.status,
                message: "Foods retrieved successfully",
                data: foods,
            });
        }
    }
    return res.json({
        status: res.status,
        message: "User not authorized",
    });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VendorController.js.map
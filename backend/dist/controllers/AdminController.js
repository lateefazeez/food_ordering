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
exports.GetVendorByID = exports.GetVendors = exports.CreateVendor = exports.findVendor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const findVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    return yield models_1.Vendor.findById(id);
});
exports.findVendor = findVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, address, pinCode, phone, email, password, } = req.body;
    const existingVendor = yield (0, exports.findVendor)("", email);
    if (existingVendor) {
        return res.json({
            staus: res.status,
            message: "A Vendor already exists with this email or phone number",
        });
    }
    // generate a salt
    const salt = yield (0, utility_1.generateSalt)();
    // hash the password along with our new salt
    const userPassword = yield (0, utility_1.generateHashedPassword)(password, salt);
    const createdVendor = yield models_1.Vendor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        address: address,
        pinCode: pinCode,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        serviceAvailable: false,
        rating: 0,
        coverImages: [],
        foods: [],
    });
    return res.json({
        staus: res.status,
        message: "Vendor created successfully",
        data: createdVendor,
    });
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    if (vendors !== null) {
        return res.json({
            status: res.status,
            message: "Vendors retrieved successfully",
            data: vendors,
        });
    }
    return res.json({
        status: res.status,
        message: "No Vendors found",
        data: [],
    });
});
exports.GetVendors = GetVendors;
const GetVendorByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    if (vendorId !== null || vendorId !== undefined) {
        const vendor = yield (0, exports.findVendor)(vendorId);
        return res.json({
            status: res.status,
            message: "Vendor retrieved successfully",
            data: vendor,
        });
    }
    return res.json({
        status: res.status,
        message: "No Vendor found",
        data: {},
    });
});
exports.GetVendorByID = GetVendorByID;
//# sourceMappingURL=AdminController.js.map
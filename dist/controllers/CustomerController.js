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
exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.UpdateCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignup = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const Customer_1 = require("../models/Customer");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const CustomerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInput, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInput;
    const salt = yield (0, utility_1.generateSalt)();
    const userPassword = yield (0, utility_1.generateHashedPassword)(password, salt);
    const { otp, expiry } = (0, utility_1.generateOTP)();
    const result = yield Customer_1.Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: "",
        lastName: "",
        verified: false,
        lat: 0,
        long: 0,
        orders: [],
    });
    if (result) {
        // send OTP to customer
        yield (0, utility_1.onRequestOTP)(otp, phone);
        // generate the signature
        const signature = (0, utility_1.generateSignature)({
            _id: result.id,
            email: result.email,
            verified: result.verified,
        });
        // send the result to client
        return res.status(200).json({
            signature: signature,
            verified: result.verified,
            email: result.email,
        });
    }
    return res.status(400).json({ message: "Error with Signup" });
});
exports.CustomerSignup = CustomerSignup;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, {
        validationError: { target: false },
    });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { email, password } = loginInputs;
    const customer = yield Customer_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.validatePassword)(password, customer.password, customer.salt);
        if (validation) {
            // generate the signature
            const signature = (0, utility_1.generateSignature)({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified,
            });
            // send the result to client
            return res.status(200).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email,
            });
        }
    }
    return res.status(400).json({ message: "Login Error" });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                // generate signature
                const signature = (0, utility_1.generateSignature)({
                    _id: updatedCustomerResponse.id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                return res.status(200).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email,
                });
            }
        }
    }
    return res.status(400).json({ message: "Error with OTP validation" });
});
exports.CustomerVerify = CustomerVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.generateOTP)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, utility_1.onRequestOTP)(otp, profile.phone);
            res.status(200).json({ message: "OTP sent to your registered number!" });
        }
    }
    return res.status(400).json({ message: "Error with OTP request" });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: "User Profile not available" });
});
exports.GetCustomerProfile = GetCustomerProfile;
const UpdateCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, {
        validationError: { target: false },
    });
    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: "User Profile cannot be updated" });
});
exports.UpdateCustomerProfile = UpdateCustomerProfile;
const CreateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // grab current logged in customer
    const customer = req.user;
    if (customer) {
        // create an oder ID
        const orderId = `${Math.floor(Math.random() * 899999) + 1000}`;
        const profile = yield Customer_1.Customer.findById(customer._id);
        const cart = req.body;
        let cartItems = Array();
        let netAmount = 0.0;
        // Calculate order amount
        const foods = yield models_1.Food.find()
            .where("_id")
            .in(cart.map((item) => item._id))
            .exec();
        foods.map((food) => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    netAmount += food.price * unit;
                    cartItems.push({ food, unit });
                }
            });
        });
        // create order with item descriptions
        if (cartItems) {
            // create order
            const currentOrder = yield Order_1.Order.create({
                orderId: orderId,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: "COD",
                paymentResponse: "",
                orderStatus: "pending",
            });
            if (currentOrder) {
                // add order to customer
                profile.orders.push(currentOrder);
                // save customer
                yield profile.save();
                return res.status(200).json(currentOrder);
            }
        }
    }
    return res.status(400).json({ message: "Error with Order Creation" });
});
exports.CreateOrder = CreateOrder;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // grab current logged in customer
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id).populate("orders");
        if (profile) {
            return res.status(200).json(profile.orders);
        }
    }
    return res.status(400).json({ message: "Error Getting Orders" });
});
exports.GetOrders = GetOrders;
const GetOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // grab current logged in customer
    const orderId = req.params.id;
    if (orderId) {
        const order = yield Order_1.Order.findById(orderId).populate("items.food");
        return res.status(200).json(order);
    }
    return res.status(400).json({ message: "Error Getting Order" });
});
exports.GetOrderById = GetOrderById;
//# sourceMappingURL=CustomerController.js.map
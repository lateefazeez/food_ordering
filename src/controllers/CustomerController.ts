import { plainToClass } from "class-transformer";
import express, { Request, Response, NextFunction } from "express";
import {
  CartItem,
  CreateCustomerInputs,
  EditCustomerProfileInputs,
  OrderInputs,
  UserLoginInputs,
} from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  generateHashedPassword,
  generateOTP,
  generateSalt,
  generateSignature,
  logger,
  onRequestOTP,
  validatePassword,
} from "../utility";
import { Customer } from "../models/Customer";
import { DeliveryDriver, Food, Vendor } from "../models";
import { Order } from "../models/Order";
import { Offer } from "../models/Offer";
import { Transaction } from "../models/Transaction";

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInput = plainToClass(CreateCustomerInputs, req.body);
  const inputErrors = await validate(customerInput, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInput;
  const salt = await generateSalt();
  const userPassword = await generateHashedPassword(password, salt);

  const { otp, expiry } = generateOTP();

  const existingCustomer = await Customer.findOne({ email: email });

  if (existingCustomer !== null) {
    return res
      .status(400)
      .json({ message: "A user exists with the provided email!" });
  }

  const result = await Customer.create({
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
    await onRequestOTP(otp, phone);

    // generate the signature
    const signature = generateSignature({
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
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }

  const { email, password } = loginInputs;

  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await validatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      // generate the signature
      const signature = generateSignature({
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
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        // generate signature
        const signature = generateSignature({
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
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = generateOTP();

      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      await onRequestOTP(otp, profile.phone);

      res.status(200).json({ message: "OTP sent to your registered number!" });
    }
  }

  return res.status(400).json({ message: "Error with OTP request" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }

  return res.status(400).json({ message: "User Profile not available" });
};

export const UpdateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();

      return res.status(200).json(result);
    }
  }

  return res.status(400).json({ message: "User Profile cannot be updated" });
};

/** ------------------------------- PAYMENT SECTION --------------------------------- **/
export const CreatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current logged in customer
  const customer = req.user;

  if (customer) {
    const { amount, paymentMode, offerId } = req.body;
    let payableAmount = Number(amount);

    if (offerId) {
      const appliedOffer = await Offer.findById(offerId);

      if (appliedOffer) {
        if (appliedOffer.isActive) {
          if (appliedOffer.promoType === "USER") {
            // Can only be applied once per user
          } else {
            // Apply offer
            payableAmount = payableAmount - appliedOffer.offerAmount;
          }
        }
      }
    }

    // Perform payment gateway charge API call

    // Create Record on Transaction
    const transaction = await Transaction.create({
      orderId: "",
      vendorId: "",
      customer: customer._id,
      orderValue: payableAmount,
      offerUsed: offerId || "NA",
      status: "OPEN" /* OPEN, SUCCESS, FAILED */,
      paymentMode: paymentMode,
      paymentResponse: "Payment is Cash on Delivery",
    });

    // Return Trabsaction Id
    return res.status(200).json(transaction);
  }

  return res.status(400).json({ message: "Error with Payment" });
};

/** ------------------------------- DELIVERY NOTIFICATION --------------------------------- **/
export const assignDelivery = async (orderId: string, vendorId: string) => {
  // find the vendor
  const vendor = await Vendor.findById(vendorId);

  if (vendor) {
    const areaCode = vendor.pinCode;
    const vendorLat = vendor.lat;
    const vendorLong = vendor.long;

    // find available delivery driver
    const deliveryDriver = await DeliveryDriver.findOne({
      isAvailable: true,
      verified: true,
      pincode: areaCode,
    });
    if (deliveryDriver) {
      logger.info(deliveryDriver[0]);
      // get the nearest delivery driver

      const currentOrder = await Order.findById(orderId);
      if (currentOrder) {
        // update order with delivery driver
        currentOrder.deliveryId = deliveryDriver.id;
        const response = await currentOrder.save();

        logger.info(response);

        // send notification to vendor about the new order using firebase push notification
      }
    }
    // check nearest delivery driver and assign order
  }

  // update delivery ID
};

/** ------------------------------- ORDER SECTION --------------------------------- **/

const validateTransaction = async (txnId: string) => {
  const currentTransaction = await Transaction.findById(txnId);

  if (currentTransaction) {
    if (currentTransaction.status.toLowerCase() !== "failed") {
      return { status: true, transaction: currentTransaction };
    }
  }

  return { status: false, transaction: null };
};

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current logged in customer
  const customer = req.user;

  const { txnId, amount, items } = <OrderInputs>req.body;

  if (customer) {
    const { status, transaction } = await validateTransaction(txnId);

    if (!status) {
      return res.status(400).json({ message: "Error with Transaction" });
    }
    // create an oder if transaction is valid
    const orderId = `${Math.floor(Math.random() * 899999) + 1000}`;

    const profile = await Customer.findById(customer._id);

    // const cart = <[OrderInputs]>req.body;

    let cartItems = Array();

    let netAmount = 0.0;

    let vendorId;

    // Calculate order amount
    const foods = await Food.find()
      .where("_id")
      .in(items.map((item) => item._id))
      .exec();

    foods.map((food) => {
      items.map(({ _id, unit }) => {
        if (food._id == _id) {
          vendorId = food.vendorId;
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    // create order with item descriptions
    if (cartItems) {
      // create order
      const currentOrder = await Order.create({
        orderId: orderId,
        vendorId: vendorId,
        items: cartItems,
        totalAmount: netAmount,
        paidAmount: amount,
        orderDate: new Date(),
        orderStatus: "pending",
        remarks: "",
        deliveryId: "",
        readyTime: 45,
      });

      profile.cart = [] as any;
      // add order to customer
      profile.orders.push(currentOrder);

      transaction.vendorId = vendorId;
      transaction.orderId = orderId;
      transaction.status = "CONFIRMED";

      transaction.save();

      // save customer
      await profile.save();

      assignDelivery(currentOrder.id, vendorId);

      return res.status(200).json(profile);
    }
  }

  return res.status(400).json({ message: "Error with Order Creation" });
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current logged in customer
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");

    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }

  return res.status(400).json({ message: "Error Getting Orders" });
};

export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current logged in customer
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    return res.status(200).json(order);
  }

  return res.status(400).json({ message: "Error Getting Order" });
};

/** ------------------------------- CART SECTION --------------------------------- **/

export const AddtoCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current logged in customer
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart");
    let cartItems = Array();

    const { _id, unit } = <CartItem>req.body;

    const food = await Food.findById(_id);

    if (food) {
      if (profile !== null) {
        cartItems = profile.cart;

        if (cartItems.length > 0) {
          //  check and update unit
          const existingFood = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );

          if (existingFood.length > 0) {
            // update unit
            const index = cartItems.indexOf(existingFood[0]);
            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              // remove from cart
              cartItems.splice(index, 1);
            }
          } else {
            // add to cart
            cartItems.push({ food, unit });
          }
        } else {
          // add to cart
          cartItems.push({ food, unit });
        }

        if (cartItems) {
          profile.cart = cartItems as any;
          const cartResult = await profile.save();
          return res.status(200).json(cartResult.cart);
        }
      }
    }
  }

  return res.status(400).json({ message: "Unable to create cart" });
};

export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current logged in customer
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");

    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }

  return res.status(400).json({ message: "Cart is empty!" });
};

export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current logged in customer
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");

    if (profile !== null) {
      profile.cart = [] as any;

      const cartResult = await profile.save();

      return res.status(200).json(cartResult);
    }
  }

  return res.status(400).json({ message: "Cart is already empty" });
};

/** ------------------------------- OFFERS SECTION --------------------------------- **/
export const VerifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offerId = req.params.id;

  if (offerId) {
    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer) {
      if (appliedOffer.isActive) {
        if (appliedOffer.promoType === "USER") {
          // Can only be applied once per user
        } else {
          return res
            .status(200)
            .json({ message: "Offer is Valid", offer: appliedOffer });
        }
      }
    }
  }

  return res.status(400).json({ message: "Offer not valid!" });
};

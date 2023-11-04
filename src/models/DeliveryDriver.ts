import mongoose, { Schema, Document } from "mongoose";

interface DeliveryDriverDoc extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  pincode: string;
  lat: number;
  long: number;
  isAvailable: boolean;
}

// Schema
const DeliveryDriverSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: false,
    },
    pincode: {
      type: String,
    },
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },
    isAvailable: {
      type: Boolean,
    },
  },
  {
    // removed these from returned json data
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

// Model
const DeliveryDriver = mongoose.model<DeliveryDriverDoc>(
  "DeliveryDriver",
  DeliveryDriverSchema
);

export { DeliveryDriver };

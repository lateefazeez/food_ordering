import mongoose, { Schema, Document } from "mongoose";

interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pinCode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: [string];
  rating: number;
  foods: any;
}

// Schema
const VendorSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    foodType: {
      type: [String],
    },
    pinCode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      // unique: true,
      // index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    serviceAvailable: {
      type: Boolean,
      default: false,
    },
    coverImages: {
      type: [String],
    },
    rating: {
      type: Number,
      default: 0,
    },
    foods: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Food",
      },
    ],
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
const Vendor = mongoose.model<VendorDoc>("Vendor", VendorSchema);

export { Vendor };

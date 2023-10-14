import mongoose, { Schema, Document } from "mongoose";

interface FoodDoc extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  vendorId: string;
  foodType: string;
  readyTime: number;
  images: [string];
  rating: number;
}

// Schema
const FoodSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    vendorId: {
      type: String,
    },
    foodType: {
      type: String,
      required: true,
    },
    readyTime: {
      type: Number,
    },
    images: {
      type: [String],
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Food = mongoose.model<FoodDoc>("Food", FoodSchema);

export { Food };

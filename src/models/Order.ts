import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderId: string; // 123456
  items: [any]; // [{ _id: string, unit: number }}]
  totalAmount: number;
  orderDate: Date;
  paidThrough: string; // COD, credit card, wallet
  paymentResponse: string; // { response: bank response, status: string }
  orderStatus: string; // pending, confirmed, delivered, cancelled
}

// Schema
const OrderSchema: Schema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
    },
    paidThrough: {
      type: String,
    },
    paymentResponse: {
      type: String,
    },
    orderStatus: {
      type: String,
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

const Order = mongoose.model<OrderDoc>("Order", OrderSchema);

export { Order };

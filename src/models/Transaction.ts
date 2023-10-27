import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
  orderId: string;
  vendorId: string;
  customer: string;
  orderValue: number;
  offerUsed: string;
  status: string;
  paymentMode: string;
  paymentResponse: string;
}

// Schema
const TransactionSchema: Schema = new Schema(
  {
    orderId: {
      type: String,
    },
    vendorId: {
      type: String,
    },
    customer: {
      type: String,
    },
    orderValue: {
      type: Number,
    },
    offerUsed: {
      type: String,
    },
    status: {
      type: String,
    },
    paymentMode: {
      type: String,
    },
    paymentResponse: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Transaction = mongoose.model<TransactionDoc>(
  "Transaction",
  TransactionSchema
);

export { Transaction };

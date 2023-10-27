import mongoose, { Schema, Document } from "mongoose";

export interface OfferDoc extends Document {
  offerType: string; // Vendor | Generic
  vendors: [any];
  title: string;
  description: string;
  minValue: number; // minimum order value
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promoCode: string;
  promoType: string; // User | All | Bank | New | Card
  bank: [any];
  bins: [any];
  pinCode: string;
  isActive: boolean;
}

// Schema
const OfferSchema: Schema = new Schema(
  {
    offerType: {
      type: String,
      required: true,
    },
    vendors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    minValue: {
      type: Number,
      required: true,
    },
    offerAmount: {
      type: Number,
      required: true,
    },
    startValidity: {
      type: Date,
    },
    endValidity: {
      type: Date,
    },
    promoCode: {
      type: String,
      required: true,
    },
    promoType: {
      type: String,
      required: true,
    },
    bank: [
      {
        type: String,
      },
    ],
    bins: [
      {
        type: Number,
      },
    ],
    pinCode: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
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

const Offer = mongoose.model<OfferDoc>("Offer", OfferSchema);

export { Offer };

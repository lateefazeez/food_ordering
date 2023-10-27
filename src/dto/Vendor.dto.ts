export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pinCode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface EditVendorInput {
  name: string;
  foodType: [string];
  address: string;
  phone: string;
}

export interface VendorPayload {
  _id: string;
  name: string;
  email: string;
  foodTypes: [string];
}

export interface CreateOfferInput {
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

export interface CreateFoodInput {
  name: string;
  description: string;
  category: string;
  price: number;
  vendorId: string;
  foodType: string;
  readyTime: number;
  images: [string];
}

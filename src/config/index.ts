export const MONGO_URI =
  process.env.API_MONGO_URI ||
  process.env.API_MONGO_URI ||
  "mongodb://localhost:27017/food-ordering-app";
// "mongodb+srv://user_2:Kgt9jcuWkrZbayDO@foodorderapp.phvty8w.mongodb.net/?retryWrites=true&w=majority";

// process.env.API_MONGO_URI || "mongodb://localhost:27017/food-ordering-app";

export const APP_SECRET_KEY = process.env.API_APP_SECRET_KEY || "secret";
export const PORT = process.env.PORT || 8000;

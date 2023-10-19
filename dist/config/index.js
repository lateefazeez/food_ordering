"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.APP_SECRET_KEY = exports.MONGO_URI = void 0;
exports.MONGO_URI = process.env.API_MONGO_URI ||
    "mongodb+srv://user_2:Kgt9jcuWkrZbayDO@foodorderapp.phvty8w.mongodb.net/?retryWrites=true&w=majority";
// process.env.API_MONGO_URI || "mongodb://localhost:27017/food-ordering-app";
exports.APP_SECRET_KEY = process.env.API_APP_SECRET_KEY || "secret";
exports.PORT = process.env.PORT || 8000;
//# sourceMappingURL=index.js.map
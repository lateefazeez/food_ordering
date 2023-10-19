import mongoose from "mongoose";
import { logger, internalErrorLogger } from "../utility/LoggerUtility";
import { MONGO_URI } from "../config";

export default async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(`error connecting to Mongo database: ${error}`);
    internalErrorLogger.error(error);
  }
};

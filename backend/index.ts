import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { logger, internalErrorLogger } from "./utility/LoggerUtility";
import { adminRoute, vendorRoute } from "./routes";
import { MONGO_URI } from "./config";

const PORT = process.env.PORT || 8000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", adminRoute);
app.use("/vendor", vendorRoute);

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    logger.info(`connected to Mongo database`);
  })
  .catch((err) => {
    logger.error(`error connecting to Mongo database: ${err}`);
  });

app.listen(PORT, () => {
  logger.info(`App started at port ${PORT}`);
});

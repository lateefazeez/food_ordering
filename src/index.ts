import express from "express";
import dotenv from "dotenv";
import App from "./services/ExpressApp";
import dbConnection from "./services/Database";
import { logger } from "./utility/LoggerUtility";
import { PORT } from "./config";

dotenv.config();

const startServer = async () => {
  const app = express();
  await dbConnection();
  await App(app);

  app.listen(PORT, () => {
    logger.info(`App started at port ${PORT}`);
  });
};

startServer();

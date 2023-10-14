import express from "express";
import App from "./services/ExpressApp";
import dbConnection from "./services/Database";
import { logger } from "./utility/LoggerUtility";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  const app = express();
  await dbConnection();
  await App(app);

  app.listen(PORT, () => {
    logger.info(`App started at port ${PORT}`);
  });
};

startServer();

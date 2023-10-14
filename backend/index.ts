import express from "express";
import expressWinston from "express-winston";
import { logger, internalErrorLogger } from "./utility/logger";

const PORT = process.env.PORT || 8000;

const app = express();

app.use("/", (req, res) => {
  return res.json({ message: "Hello from Food Order Backend" });
});

app.listen(PORT, () => {
  logger.info(`App started at port ${PORT}`);
});

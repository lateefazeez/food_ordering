import express, { Application } from "express";
import bodyParser from "body-parser";
import path from "path";
import {
  adminRoute,
  shoppingRoute,
  vendorRoute,
  customerRoute,
} from "../routes";

const PORT = process.env.PORT || 8000;

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use("/admin", adminRoute);
  app.use("/vendor", vendorRoute);
  app.use("/customer", customerRoute);

  app.use(shoppingRoute);

  return app;
};

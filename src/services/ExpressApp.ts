import express, { Application } from "express";
import path from "path";
import {
  adminRoute,
  shoppingRoute,
  vendorRoute,
  customerRoute,
} from "../routes";

const PORT = process.env.PORT || 8000;

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const imagePath = path.join(__dirname, "../images");
  app.use("/images", express.static(imagePath));

  app.use("/admin", adminRoute);
  app.use("/vendor", vendorRoute);
  app.use("/customer", customerRoute);

  app.use(shoppingRoute);

  return app;
};

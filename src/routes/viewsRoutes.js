import { Router } from "express";
import ProductMongoManager from "../managers/ProductMongoManager.js";

const router = Router();

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    style: "/assets/css/styles.css",
  });
});

router.get("/products", async (req, res) => {
  let products = await ProductMongoManager.getProducts();
  console.log(products);
  res.render("home", {
    products,
    style: "/assets/css/styles.css",
  });
});

export default router;

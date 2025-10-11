import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const manager = new ProductManager("src/data/products.json");
const router = Router();

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    style: "/assets/css/styles.css",
  });
});

router.get("/products", async (req, res) => {
  let products = await manager.getProducts();
  res.render("home", {
    products,
    style: "/assets/css/styles.css",
  });
});

export default router;

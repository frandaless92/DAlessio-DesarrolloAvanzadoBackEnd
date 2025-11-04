import e, { Router } from "express";
import { isValidObjectId } from "mongoose";
import ProductMongoManager from "../managers/ProductMongoManager.js";
import CartMongoManager from "../managers/CartMongoManager.js";

const router = Router();

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    style: "/assets/css/styles.css",
  });
});

router.get("/products", async (req, res) => {
  const cartId = req.query.cartId;
  let products = await ProductMongoManager.getProducts();
  res.render("home", {
    products,
    cartId,
    style: "/assets/css/styles.css",
  });
});

router.get("/carts", async (req, res) => {
  let carts = await CartMongoManager.getCarts();
  res.render("carts", {
    carts,
    style: "/assets/css/carts.css",
  });
});

router.get("/carts/:id", async (req, res) => {
  let cartId = req.params.id;
  if (!isValidObjectId(cartId)) {
    return res.status(400).send("ID de carrito inválido");
  }
  try {
    console.log(cartId);
    let cart = await CartMongoManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }
    res.render("cartsDetail", {
      cart,
      style: "/assets/css/carts.css",
    });
  } catch (error) {
    return res.status(500).send("Error al obtener el carrito");
  }
});

export default router;

import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const carts = new CartManager("./data/carts.json");
const products = new ProductManager("./data/products.json");

//crear carrito
router.post("/", async (_req, res) => {
  const cart = await carts.createCart();
  res.status(201).json({ cart });
});

// listar productos del carrito
router.get("/:cid", async (req, res) => {
  const cart = await carts.getById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json({ products: cart.products });
});

// agregar producto x1
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const p = await products.getProductById(pid);
  if (!p) return res.status(404).json({ error: "Producto inexistente" });

  const updated = await carts.addProduct(cid, pid, 1);
  if (!updated) return res.status(404).json({ error: "Carrito no encontrado" });
  res.status(201).json({ cart: updated });
});

export default router;

import { Router } from "express";
import CartMongoManager from "../managers/CartMongoManager.js";
import ProductMongoManager from "../managers/ProductMongoManager.js";

const router = Router();

// 🟢 Crear un carrito vacío
router.post("/", async (_req, res) => {
  try {
    const cart = await CartMongoManager.createCart();
    res.status(201).json({ cart });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

// 🔵 Obtener un carrito por su _id y listar productos
router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartMongoManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json({ products: cart.products });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

// 🟣 Obtener todos los carritos (opcional)
router.get("/", async (_req, res) => {
  try {
    const carts = await CartMongoManager.getCarts();
    res.json({ carts });
  } catch (error) {
    console.error("Error al listar carritos:", error);
    res.status(500).json({ error: "Error al listar carritos" });
  }
});

// 🟠 Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Verificar que el producto exista
    const product = await ProductMongoManager.getProductBy({ _id: pid });
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    const updatedCart = await CartMongoManager.addProductToCart(cid, pid, 1);
    res.status(201).json({ cart: updatedCart });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

// 🔴 Eliminar un carrito
router.delete("/:cid", async (req, res) => {
  try {
    const result = await CartMongoManager.deleteCart(req.params.cid);
    res.json(result);
  } catch (error) {
    console.error("Error al eliminar carrito:", error);
    res.status(500).json({ error: "Error al eliminar carrito" });
  }
});

export default router;

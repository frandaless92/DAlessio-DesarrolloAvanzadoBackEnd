import { Router } from "express";
import CartMongoManager from "../managers/CartMongoManager.js";
import ProductMongoManager from "../managers/ProductMongoManager.js";

const router = Router();

router.post("/", async (_req, res) => {
  try {
    const cart = await CartMongoManager.createCart();
    res.status(201).json({ cart });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const carts = await CartMongoManager.getCarts();
    res.json({ carts });
  } catch (error) {
    console.error("Error al obtener carritos:", error);
    res.status(500).json({ error: "Error al obtener carritos" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartMongoManager.getCartById(req.params.cid);
    res.json({ cart });
  } catch (error) {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartMongoManager.getCartById(cid);
    const product = await ProductMongoManager.getProductBy({ _id: pid });
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    // Buscar si el producto ya está en el carrito
    const existingProduct = cart.products.find(
      (p) => p.product._id.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    const updated = await CartMongoManager.updateCart(cid, {
      products: cart.products,
    });
    res.status(201).json({ cart: updated });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }

    const cart = await CartMongoManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = cart.products.find((p) => p.product._id.toString() === pid);
    if (!product)
      return res.status(404).json({ error: "Producto no está en el carrito" });

    product.quantity = quantity;

    const updated = await CartMongoManager.updateCart(cid, {
      products: cart.products,
    });
    res.json({ cart: updated });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar cantidad del producto" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartMongoManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const newProducts = cart.products.filter(
      (p) => p.product._id.toString() !== pid
    );

    const updated = await CartMongoManager.updateCart(cid, {
      products: newProducts,
    });
    res.json({ cart: updated });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body; // debe ser [{ product, quantity }]
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: "El body debe incluir un arreglo de productos" });
    }

    const updatedCart = await CartMongoManager.updateCart(req.params.cid, {
      products,
    });
    res.json({ cart: updatedCart });
  } catch (error) {
    console.error("Error al reemplazar productos:", error);
    res.status(500).json({ error: "Error al actualizar carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cart = await CartMongoManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const cleared = await CartMongoManager.updateCart(req.params.cid, {
      products: [],
    });
    res.json({ message: "Carrito vaciado correctamente", cart: cleared });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
});

router.delete("/remove/:cid", async (req, res) => {
  try {
    const result = await CartMongoManager.deleteCart(req.params.cid);
    res.json(result);
  } catch (error) {
    console.error("Error al eliminar carrito:", error);
    res.status(500).json({ error: "Error al eliminar carrito" });
  }
});

export default router;

import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json({ products });
});

router.get("/:pid", async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ product });
});

router.post("/", async (req, res) => {
  try {
    const created = await manager.addProduct(req.body);
    res.status(201).json({ product: created });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    if (!updated)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ product: updated });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const ok = await manager.deleteProduct(req.params.pid);
  if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: "Producto eliminado" });
});

export default router;

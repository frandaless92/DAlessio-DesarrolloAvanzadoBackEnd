import { Router } from "express";
import ProductMongoManager from "../managers/ProductMongoManager.js";
import { serverSocket } from "../app.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await ProductMongoManager.getProducts();
  res.json({ products });
});

router.get("/:pid", async (req, res) => {
  const product = await ProductMongoManager.getProductById(req.params.pid);
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ product });
});

// En tu archivo de rutas

router.post("/", async (req, res) => {
  try {
    const product = req.body;

    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];
    for (const field of requiredFields) {
      if (product[field] === undefined) {
        return res
          .status(400)
          .json({ error: `Campo requerido faltante: ${field}` });
      }
    }

    if (product.thumbnails && !Array.isArray(product.thumbnails)) {
      return res
        .status(400)
        .json({ error: "El campo 'thumbnails' debe ser un array." });
    }

    const allProducts = await ProductMongoManager.getProducts();
    if (allProducts.some((p) => p.code === product.code)) {
      return res
        .status(400)
        .json({ error: `El código de producto '${product.code}' ya existe.` });
    }

    const createdProduct = await ProductMongoManager.addProduct(product);

    const updatedProducts = await ProductMongoManager.getProducts();
    serverSocket.emit("updateProducts", updatedProducts);

    res.status(201).json({ status: "success", product: createdProduct });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ status: "error", error: "Error interno del servidor" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updated = await ProductMongoManager.updateProduct(
      req.params.pid,
      req.body
    );
    if (!updated)
      return res.status(404).json({ error: "Producto no encontrado" });
    serverSocket.emit(
      "updateProducts",
      await ProductMongoManager.getProducts()
    );
    res.json({ product: updated });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const ok = await ProductMongoManager.deleteProduct(req.params.pid);
  if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
  serverSocket.emit("updateProducts", await ProductMongoManager.getProducts());
  res.json({ message: "Producto eliminado" });
});

export default router;

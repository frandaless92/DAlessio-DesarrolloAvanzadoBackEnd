import express from "express";
import productsRouter from "./routes/ProductsRoutes.js";
import cartsRouter from "./routes/CartsRoutes.js";

const app = express();
const PORT = 8080;

app.use(express.json());

// montar routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (_req, res) => res.send("Entrega 1"));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

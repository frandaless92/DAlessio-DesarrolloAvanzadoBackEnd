import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/ProductsRoutes.js";
import cartsRouter from "./routes/CartsRoutes.js";
import viewsRouter from "./routes/viewsRoutes.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const PORT = 8080;
const manager = new ProductManager("src/data/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./src/views");
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/views", viewsRouter);

app.get("/", (_req, res) => res.send("Entrega 2"));

const serverHTTP = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const serverSocket = new Server(serverHTTP);

serverSocket.on("connection", (socket) => {
  const updateProducts = async () => {
    const products = await manager.getProducts();
    serverSocket.emit("updateProducts", products);
  };
  updateProducts();
});

export { serverSocket };

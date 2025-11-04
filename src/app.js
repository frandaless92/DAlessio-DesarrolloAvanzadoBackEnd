import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/ProductsRoutes.js";
import cartsRouter from "./routes/CartsRoutes.js";
import viewsRouter from "./routes/viewsRoutes.js";
import ProductMongoManager from "./managers/ProductMongoManager.js";
import { connDB } from "./config/db.js";

const app = express();
const PORT = 8080;

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
    const products = await ProductMongoManager.getProducts();
    serverSocket.emit("updateProducts", products);
  };
  updateProducts();
});

connDB(
  "mongodb+srv://fndalessio_db_user:sKHTjWCRHQRJk9W8@cluster0.lsov6pi.mongodb.net/?appName=Cluster0",
  "e-commerce"
);

export { serverSocket };

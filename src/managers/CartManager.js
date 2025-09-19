import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  //Creamos métodos de escritura y lectura para simplificar las funciones
  async #read() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data || "[]");
    } catch (e) {
      console.error("Error al leer Carrito:", e);
      return [];
    }
  }

  async #write(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  #nextId(items) {
    const max = items.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0);
    return String(max + 1);
  }

  async createCart() {
    const carts = await this.#read();
    const newCart = { id: this.#nextId(carts), products: [] };
    carts.push(newCart);
    await this.#write(carts);
    return newCart;
  }

  async getById(id) {
    const carts = await this.#read();
    return carts.find((c) => String(c.id) === String(id)) || null;
  }

  async addProduct(cid, pid, qty = 1) {
    const carts = await this.#read();
    const idx = carts.findIndex((c) => String(c.id) === String(cid));
    if (idx === -1) return null;

    const cart = carts[idx];
    const pidx = cart.products.findIndex(
      (it) => String(it.product) === String(pid)
    );

    if (pidx === -1) {
      cart.products.push({ product: String(pid), quantity: Number(qty) || 1 });
    } else {
      cart.products[pidx].quantity += Number(qty) || 1;
    }

    carts[idx] = cart;
    await this.#write(carts);
    return cart;
  }
}

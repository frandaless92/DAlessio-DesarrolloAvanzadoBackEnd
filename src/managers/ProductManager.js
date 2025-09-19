import fs from "fs";

export default class ProductManager {
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
      console.error("Error al leer productos:", e);
      return [];
    }
  }

  async #write(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return this.#read();
  }

  async getProductById(id) {
    const products = await this.#read();
    return products.find((p) => String(p.id) === String(id)) || null;
  }

  #nextId(products) {
    // aseguramos id único aunque se hayan eliminado productos: max + 1
    const max = products.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);
    return String(max + 1);
  }

  async addProduct(product) {
    const required = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
    ];
    for (const f of required) {
      if (product[f] === undefined) {
        throw new Error(`Campo requerido faltante: ${f}`);
      }
    }
    if (product.thumbnails && !Array.isArray(product.thumbnails)) {
      throw new Error("thumbnails debe ser un array de strings");
    }

    const items = await this.#read();

    // codigo único para cada producto
    if (items.some((p) => p.code === product.code)) {
      throw new Error("Código de producto ya existente");
    }

    const newItem = {
      id: this.#nextId(items),
      title: String(product.title),
      description: String(product.description),
      code: String(product.code),
      price: Number(product.price),
      status: Boolean(product.status),
      stock: Number(product.stock),
      category: String(product.category),
      thumbnails: Array.isArray(product.thumbnails) ? product.thumbnails : [],
    };

    items.push(newItem);
    await this.#write(items);
    return newItem;
  }

  // Modifica un producto por ID
  async updateProduct(id, updatedFields) {
    const products = await this.#read();
    const idx = products.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;

    const { id: _, ...rest } = updatedFields; // no permite modificar ID

    if (rest.thumbnails && !Array.isArray(rest.thumbnails)) {
      throw new Error("thumbnails debe ser un array de strings");
    }

    products[idx] = { ...products[idx], ...rest, id: products[idx].id };
    await this.#write(products);
    return products[idx];
  }

  // Elimina un producto por ID
  async deleteProduct(id) {
    const products = await this.#read();
    const filtered = products.filter((p) => String(p.id) !== String(id));
    if (filtered.length === products.length) return false;
    await this.#write(filtered);
    return true;
  }
}

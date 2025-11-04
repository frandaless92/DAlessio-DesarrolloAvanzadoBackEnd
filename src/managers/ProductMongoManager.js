import { productModel } from "./models/productsModel.js";

export default class ProductMongoManager {
  static async getProducts(filtro = {}) {
    return await productModel.find(filtro).lean();
  }

  static async getProductById(id) {
    return await productModel.findById(id);
  }

  static async addProduct(product) {
    const newProduct = await productModel.create(product);
    return product;
  }

  static async updateProduct(id, updatedFields) {
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );
    return updatedProduct;
  }

  static async deleteProduct(id) {
    const result = await productModel.findByIdAndDelete(id);
    return result !== null;
  }
}

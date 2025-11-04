import { productModel } from "./models/productsModel.js";

export default class ProductMongoManager {
  static async getProducts(filtro = {}) {
    return await productModel.find(filtro).lean();
  }

  static async getProductBy(filtro = {}) {
    return await productModel.findOne(filtro).lean();
  }

  static async addProduct(product) {
    const newProduct = await productModel.create(product);
    return product.toJSON();
  }

  static async updateProduct(id, updatedFields) {
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );
    return updatedProduct.toJSON();
  }

  static async deleteProduct(id) {
    const result = await productModel.findByIdAndDelete(id);
    return result !== null;
  }
}

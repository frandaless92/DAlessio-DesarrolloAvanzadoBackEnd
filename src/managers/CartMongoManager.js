import cartModel from "./models/cartsModel.js";

class CartMongoManager {
  static async createCart(data = { products: [] }) {
    try {
      const newCart = await cartModel.create(data);
      return newCart.toObject();
    } catch (error) {
      console.error("Error al crear carrito:", error);
      throw error;
    }
  }

  static async getCarts() {
    try {
      return await cartModel.find().populate("products.product").lean();
    } catch (error) {
      console.error("Error al obtener carritos:", error);
      throw error;
    }
  }

  static async getCartById(cartId) {
    try {
      const cart = await cartModel
        .findById(cartId)
        .populate("products.product")
        .lean();
      if (!cart) throw new Error("Carrito no encontrado");
      return cart;
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      throw error;
    }
  }

  static async updateCart(cartId, updateData) {
    try {
      const updatedCart = await cartModel
        .findByIdAndUpdate(cartId, updateData, { new: true })
        .populate("products.product")
        .lean();
      if (!updatedCart) throw new Error("Carrito no encontrado");
      return updatedCart;
    } catch (error) {
      console.error("Error al actualizar carrito:", error);
      throw error;
    }
  }

  static async deleteCart(cartId) {
    try {
      const deleted = await cartModel.findByIdAndDelete(cartId);
      if (!deleted) throw new Error("Carrito no encontrado");
      return { message: "Carrito eliminado correctamente" };
    } catch (error) {
      console.error("Error al eliminar carrito:", error);
      throw error;
    }
  }
}

export default CartMongoManager;

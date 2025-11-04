import mongoose from "mongoose";

const productInCartSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId, // referencia al _id de products
      ref: "products", // nombre del modelo relacionado
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "La cantidad debe ser al menos 1"],
    },
  },
  { _id: false } // no queremos un _id extra dentro de cada producto
);

// Definimos el schema principal "cart"
const cartSchema = new mongoose.Schema({
  products: {
    type: [productInCartSchema],
    default: [],
  },
});

// Creamos el modelo
const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;

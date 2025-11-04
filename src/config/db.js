import mongoose from "mongoose";

export const connDB = async (url, dbName) => {
  // Aquí iría la lógica para conectar a la base de datos
  try {
    await mongoose.connect(url, {
      dbName: dbName,
    });
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

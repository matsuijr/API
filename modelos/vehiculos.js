const mongoose = require("mongoose");

/*
  Vehiculo

    Este modelo representa los vehiculos que los usuarios que si o si deben estar autenticados,
    publica ndentro de TicoAutos.

    Cada vehiculo pertenece a un usuario, puede tener multiples imagenes, puede recibir preguntas de otros usuarios.
*/

const esquemaVehiculo = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: true,
      trim: true,
    },
    modelo: {
      type: String,
      required: true,
      trim: true,
    },
    anio: {
      type: Number,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["disponible", "vendido"],
      default: "disponible",
    },

    /*
        Se utiliza un arreglo de strings donde cada string
        representa la URL o ruta de una imagen.
    */
    imagenes: [
      {
        type: String,
      },
    ],

    /*
        Se guarda la referencia al usuario que publico
        el vehiculo.
    */
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    // Agrega automaticamente createdAt y updatedAt
    timestamps: true,
  },
);

// Exportamos el modelo para poder usarlo en controladores
module.exports = mongoose.model("Vehiculo", esquemaVehiculo);

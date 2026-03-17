const mongoose = require("mongoose");

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

    imagenes: [
      {
        type: String,
      },
    ],
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vehiculo", esquemaVehiculo);

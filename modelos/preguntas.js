const mongoose = require("mongoose");

const preguntaSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  vehiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehiculo",
    required: true,
  },
  respondida: { type: Boolean, default: false },
});

module.exports = mongoose.model("Pregunta", preguntaSchema);

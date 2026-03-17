const mongoose = require("mongoose");

const respuestaSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  pregunta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pregunta",
    required: true,
  },
});

module.exports = mongoose.model("Respuesta", respuestaSchema);

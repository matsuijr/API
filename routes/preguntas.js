const express = require("express");
const router = express.Router();
const Pregunta = require("../modelos/preguntas");
const Vehiculo = require("../modelos/vehiculos");
const auth = require("../middleware/autenticacionMiddleware");

// Crear pregunta (solo una pendiente por usuario/vehículo)
router.post("/vehiculos/:id/preguntas", auth, async (req, res) => {
  try {
    // Verificar que el vehículo exista
    const vehiculoId = req.params.id;
    const usuarioId = req.usuario._id;

    //variable para verificar si el usuario ya tiene una pregunta pendiente para ese vehículo
    const pendiente = await Pregunta.findOne({
      vehiculo: vehiculoId,
      usuario: usuarioId,
      respondida: false,
    });
    if (pendiente) {
      return res.status(400).json({
        mensaje: "Ya tienes una pregunta pendiente, espera la respuesta.",
      });
    }
    //se crea la pregunta
    const pregunta = new Pregunta({
      texto: req.body.texto,
      usuario: usuarioId,
      vehiculo: vehiculoId,
    });

    //se guarda la pregunta en la base de datos
    await pregunta.save();
    res.json(pregunta);
    console.log("Ruta de preguntas cargada");
  } catch (error) {
    console.error("Error al crear pregunta:", error);
    res.status(500).json({ mensaje: "Error al crear pregunta" });
  }
});

// Listar preguntas de un vehículo
router.get("/vehiculos/:id/preguntas", async (req, res) => {
  try {
    //se busca la pregunta en la base de datos por el id del vehículo y
    //se popula el campo usuario para mostrar el nombre del usuario que hizo la pregunta
    const preguntas = await Pregunta.find({ vehiculo: req.params.id }).populate(
      "usuario",
      "nombre",
    );
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener preguntas" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Pregunta = require("../modelos/preguntas");
const Respuesta = require("../modelos/respuestas");
const auth = require("../middleware/autenticacionMiddleware");

// Responder pregunta (solo propietario del vehículo)
router.post("/preguntas/:id/respuestas", auth, async (req, res) => {
  try {
    const pregunta = await Pregunta.findById(req.params.id).populate(
      "vehiculo",
    );
    console.log("Pregunta encontrada:", pregunta);
    if (!pregunta)
      return res.status(404).json({ mensaje: "Pregunta no encontrada" });

    if (
      // Verificar que el usuario autenticado es el propietario del vehículo
      pregunta.vehiculo.propietario.toString() !== req.usuario._id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No puedes responder preguntas de vehículos que no son tuyos.",
      });
    }
    // Verificar que la pregunta no haya sido respondida previamente
    if (pregunta.respondida) {
      return res
        .status(400)
        .json({ mensaje: "Esta pregunta ya fue respondida." });
    }
    // Crear la respuesta
    const respuesta = new Respuesta({
      texto: req.body.texto,
      usuario: req.usuario._id,
      pregunta: pregunta._id,
    });

    await respuesta.save();

    pregunta.respondida = true;
    await pregunta.save();

    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al responder pregunta" });
  }
});

// Listar respuestas de una pregunta
router.get("/preguntas/:id/respuestas", async (req, res) => {
  try {
    // Verificar que la pregunta exista
    const respuestas = await Respuesta.find({
      pregunta: req.params.id,
    }).populate("usuario", "nombre");
    res.json(respuestas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener respuestas" });
  }
});

module.exports = router;

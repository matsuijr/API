const express = require("express");
const router = express.Router();
const Pregunta = require("../modelos/preguntas");
const Respuesta = require("../modelos/respuestas");
const Vehiculo = require("../modelos/vehiculos");
const auth = require("../middleware/autenticacionMiddleware");

// Obtener conversación de un vehículo (propietario ve todo, comprador ve solo lo suyo)
router.get("/vehiculos/:id/conversacion", auth, async (req, res) => {
  try {
    const vehiculoId = req.params.id;
    const usuarioId = req.usuario._id;

    const vehiculo = await Vehiculo.findById(vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    }

    // Si es propietario, ve todas las preguntas y respuestas
    if (vehiculo.propietario.toString() === usuarioId.toString()) {
      const preguntas = await Pregunta.find({ vehiculo: vehiculoId }).populate(
        "usuario",
        "nombre",
      );
      // Obtener respuestas para esas preguntas
      const respuestas = await Respuesta.find({
        pregunta: { $in: preguntas.map((p) => p._id) },
      }).populate("usuario", "nombre");

      return res.json(
        // Mapear preguntas con sus respuestas correspondientes
        preguntas.map((p) => ({
          pregunta: p,
          respuesta:
            respuestas.find(
              (r) => r.pregunta.toString() === p._id.toString(),
            ) || null,
        })),
      );
    }

    // Si es comprador, solo sus propias preguntas y respuestas
    const preguntas = await Pregunta.find({
      vehiculo: vehiculoId,
      usuario: usuarioId,
    }).populate("usuario", "nombre");

    // Obtener respuestas para esas preguntas
    const respuestas = await Respuesta.find({
      pregunta: { $in: preguntas.map((p) => p._id) },
    }).populate("usuario", "nombre");

    return res.json(
      // Mapear preguntas con sus respuestas correspondientes
      preguntas.map((p) => ({
        pregunta: p,
        respuesta:
          respuestas.find((r) => r.pregunta.toString() === p._id.toString()) ||
          null,
      })),
    );
  } catch (error) {
    console.error("Error al obtener conversación:", error);
    res.status(500).json({ mensaje: "Error al obtener conversación" });
  }
});

router.get("/usuario/:id/conversaciones", async (req, res) => {
  try {
    // Preguntas hechas por el usuario (como comprador)
    const preguntas = await Pregunta.find({ usuario: req.params.id })
      .populate("vehiculo", "marca modelo _id")
      .sort({ fecha: -1 });

    // Vehículos del usuario (como propietario)
    const vehiculosPropios = await Vehiculo.find({
      propietario: req.params.id,
    });
    // Preguntas sobre los vehículos del usuario
    const preguntasSobreMisVehiculos = await Pregunta.find({
      vehiculo: { $in: vehiculosPropios.map((v) => v._id) },
    })
      .populate("usuario", "nombre")
      .populate("vehiculo", "marca modelo _id")
      .sort({ fecha: -1 });

    res.json({
      comoComprador: preguntas,
      comoPropietario: preguntasSobreMisVehiculos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener conversaciones del usuario" });
  }
});

module.exports = router;

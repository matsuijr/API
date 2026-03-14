const express = require("express");
const router = express.Router();

const Vehiculo = require("../modelos/vehiculos");
const verificarToken = require("../middleware/autenticacionMiddleware");

//Crear Vehiculo
router.post("/", verificarToken, async (req, res) => {
  try {
    const { marca, modelo, anio, precio, descripcion, imagenes } = req.body;

    const vehiculo = new Vehiculo({
      marca,
      modelo,
      anio,
      precio,
      descripcion,
      imagenes,

      // el propietario es el usuario autenticado
      propietario: req.usuario.id,
    });

    await vehiculo.save();

    res.status(201).json({
      mensaje: "Vehículo creado correctamente",
      vehiculo,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear vehículo",
    });
  }
});
//Obtener todos los vehiculos de prueba solo sera la marca
router.get("/", async (req, res) => {
  try {
    const filtros = {};

    if (req.query.marca) {
      filtros.marca = new RegExp(req.query.marca, "i");
    }

    if (req.query.anio) {
      filtros.anio = req.query.anio;
    }

    if (req.query.precioMin || req.query.precioMax) {
      filtros.precio = {};

      if (req.query.precioMin) {
        filtros.precio.$gte = req.query.precioMin;
      }

      if (req.query.precioMax) {
        filtros.precio.$lte = req.query.precioMax;
      }
    }

    // PAGINACION
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const vehiculos = await Vehiculo.find(filtros)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("propietario", "nombre");

    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vehículos" });
  }
});

//ontener un vehiculo por id
router.get("/:id", async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id).populate(
      "propietario",
      "nombre email",
    );

    if (!vehiculo) {
      return res.status(404).json({
        mensaje: "Vehículo no encontrado",
      });
    }

    res.json(vehiculo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener vehículo",
    });
  }
});

module.exports = router;

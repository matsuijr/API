const express = require("express");
const router = express.Router();
const Vehiculo = require("../modelos/vehiculos");
const verificarToken = require("../middleware/autenticacionMiddleware");
const multer = require("multer");
const path = require("path");
// Configuración de multer para manejo de archivos de las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imagenes/"); // carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Configuración de multer para manejo de archivos de las imágenes
const upload = multer({ storage });

router.post("/", verificarToken, upload.single("imagen"), async (req, res) => {
  try {
    const { marca, modelo, anio, precio, descripcion } = req.body;

    const vehiculo = new Vehiculo({
      marca,
      modelo,
      anio,
      precio,
      descripcion,
      imagenes: [req.file ? `/imagenes/${req.file.filename}` : ""],
      propietario: req.usuario.id,
    });

    await vehiculo.save();
    res
      .status(201)
      .json({ mensaje: "Vehículo creado correctamente", vehiculo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear vehículo" });
  }
});
router.get("/", async (req, res) => {
  try {
    const filtros = {};
    // Aplicar filtros de búsqueda
    if (req.query.marca) {
      filtros.marca = new RegExp(req.query.marca, "i");
    }
    if (req.query.modelo) {
      filtros.modelo = new RegExp(req.query.modelo, "i");
    }
    if (req.query.estado) {
      filtros.estado = req.query.estado;
    }
    if (req.query.precioMin || req.query.precioMax) {
      filtros.precio = {};
      if (req.query.precioMin)
        filtros.precio.$gte = Number(req.query.precioMin);
      if (req.query.precioMax)
        filtros.precio.$lte = Number(req.query.precioMax);
    }
    if (req.query.minYear || req.query.maxYear) {
      filtros.anio = {};
      if (req.query.minYear) filtros.anio.$gte = Number(req.query.minYear);
      if (req.query.maxYear) filtros.anio.$lte = Number(req.query.maxYear);
    }
    // Paginación
    const pagina = Number(req.query.page) || 1;
    const limite = 6;
    const skip = (pagina - 1) * limite;
    // Obtener vehículos con filtros y paginación
    const vehiculos = await Vehiculo.find(filtros)
      .skip(skip)
      .limit(limite)
      .populate("propietario", "nombre");

    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vehículos" });
  }
});
// Obtener vehículos del usuario autenticado
router.get("/mis", verificarToken, async (req, res) => {
  try {
    const { page = 1, limit = 6, marca, precioMin, precioMax } = req.query;
    // Construir filtros de búsqueda
    const filtros = {
      propietario: req.usuario.id,
    };

    if (marca) {
      filtros.marca = new RegExp(marca, "i");
    }

    if (precioMin || precioMax) {
      filtros.precio = {};
      if (precioMin) filtros.precio.$gte = Number(precioMin);
      if (precioMax) filtros.precio.$lte = Number(precioMax);
    }
    // Obtener vehículos con filtros y paginación
    const vehiculos = await Vehiculo.find(filtros)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(vehiculos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en mis vehiculos" });
  }
});

// Obtener un vehiculo por id
router.get("/:id", async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id).populate(
      "propietario",
      "nombre email _id",
    );

    if (!vehiculo) {
      return res.status(404).json({
        mensaje: "Vehículo no encontrado",
      });
    }
    // Convertir el ID del propietario a string para evitar problemas
    vehiculo.propietario._id = vehiculo.propietario._id.toString();
    res.json(vehiculo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener vehículo",
    });
  }
});

// Eliminar un vehículo por id
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    // Verificar que el vehículo exista y que el usuario autenticado sea el propietario
    const vehiculo = await Vehiculo.findByIdAndDelete(req.params.id);
    console.log("Vehículo encontrado:", vehiculo);
    if (!vehiculo) {
      return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    }
    res.json({ mensaje: "Vehículo eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar vehículo", error: err });
  }
});
// Marcar un vehículo como vendido
router.patch("/:id/estado", async (req, res) => {
  try {
    // Verificar que el vehículo exista
    const vehiculo = await Vehiculo.findByIdAndUpdate(
      req.params.id,
      { estado: "vendido" },
      { new: true },
    );
    if (!vehiculo) {
      return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    }
    res.json({ mensaje: "Vehículo marcado como vendido", vehiculo });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar estado", error: err });
  }
});
module.exports = router;

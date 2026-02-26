const express = require("express");
const router = express.Router();
const Usuario = require("../modelos/usuarios");

// POST - crear usuario
router.post("/", async (req, res) => {
  const usuario = new Usuario({
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    email: req.body.email,
    password: req.body.password,
    edad: req.body.edad,
  });

  try {
    const usuarioCreado = await usuario.save();
    res.header("Location", `/usuario?id=${usuarioCreado._id}`);
    res.status(201).json(usuarioCreado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Usuario.find();
      return res.status(200).json(data);
    }

    const data = await Usuario.findById(req.query.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT
router.put("/", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
    });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - eliminar
router.delete("/", async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "Usuario Eliminado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

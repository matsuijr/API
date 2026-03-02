const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../modelos/usuarios");
const verificarToken = require("../middleware/autenticacionMiddleware");

const router = express.Router();

const CLAVE_JWT = "clave_secreta";

/**
 * REGISTRO DE USUARIO
 */
router.post("/registro", async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const usuario = new Usuario({
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      email: req.body.email,
      password: passwordHash, // guardamos la contraseña encriptada
      edad: req.body.edad,
    });

    const usuarioGuardado = await usuario.save();

    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // buscamos por email
    const usuario = await Usuario.findOne({ email: email });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // comparamos password vs hash
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // generamos el token
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      CLAVE_JWT,
      { expiresIn: "2h" },
    );

    res.status(200).json({
      mensaje: "Login exitoso",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Ruta protegida de prueba
router.get("/protegida", verificarToken, (req, res) => {
  res.json({
    mensaje: "Acceso permitido",
    usuario: req.usuario,
  });
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../modelos/usuarios");
const verificarToken = require("../middleware/autenticacionMiddleware");
require("dotenv").config();

const router = express.Router();

const CLAVE_JWT = process.env.JWT_SECRET;

router.post("/registro", async (req, res) => {
  try {
    // transformamos la contraseña a un hash seguro
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    // creamos el nuevo usuario con la contraseña encriptada
    const usuario = new Usuario({
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      email: req.body.email,
      password: passwordHash, // guardamos la contraseña encriptada
      edad: req.body.edad,
    });
    // guardamos el usuario en la base de datos
    const usuarioGuardado = await usuario.save();

    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // buscamos el usuario por email
    const usuario = await Usuario.findOne({ email: email });
    // si no existe el usuario, respondemos con error
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // comparamos la contraseña ingresada con el hash almacenado
    const passwordValido = await bcrypt.compare(password, usuario.password);

    // si la contraseña no es válida, respondemos con error
    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // si el login es exitoso, generamos un token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      CLAVE_JWT,
      { expiresIn: "2h" },
    );
    // respondemos con el token y los datos del usuario (sin la contraseña)
    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.password;
    res.status(200).json({
      mensaje: "Login exitoso",
      token: token,
      usuario: usuarioSinPassword,
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Ruta protegida que requiere autenticación
router.get("/protegida", verificarToken, (req, res) => {
  res.json({
    mensaje: "Acceso permitido",
    usuario: req.usuario,
  });
});

module.exports = router;

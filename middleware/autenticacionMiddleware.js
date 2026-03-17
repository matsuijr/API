const jwt = require("jsonwebtoken");
require("dotenv").config();

// Este middleware verifica si el token es válido
const verificarToken = (req, res, next) => {
  try {
    // leer el header Authorization
    const headerAuth = req.headers["authorization"];

    // Si no viene token da error
    if (!headerAuth) {
      return res.status(401).json({ mensaje: "Token requerido" });
    }

    //extrae el token
    const token = headerAuth.split(" ")[1];

    //verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: decoded.id,
      _id: decoded.id,
      email: decoded.email,
    };

    //Continuar hacia la ruta
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

module.exports = verificarToken;

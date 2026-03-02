const jwt = require("jsonwebtoken");

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
    const decoded = jwt.verify(token, "clave_secreta");

    req.usuario = decoded;

    //Continuar hacia la ruta
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

module.exports = verificarToken;

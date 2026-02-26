require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected Proyecto");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connectDB();

// Middlewares
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "*",
  }),
);

//Importamos las rutas
const usuarioRoutes = require("./routes/usuarios");

// Usamos las rutas
app.use("/usuario", usuarioRoutes);

// Servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

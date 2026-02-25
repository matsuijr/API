const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Course = require("./models/course");
const Profesor = require("./models/profesor");

mongoose.connect("mongodb://127.0.0.1:27017/utnapi");

const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected w3");
});

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "*",
  }),
);
//Profesor
app.post("/profesor", async (req, res) => {
  try {
    const profesor = new Profesor({
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      cedula: req.body.cedula,
      edad: req.body.edad,
    });

    const profesorCreado = await profesor.save();
    res.status(201).json(profesorCreado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/profesor", async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Profesor.find();
      return res.status(200).json(data);
    }

    const data = await Profesor.findById(req.query.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/profesor", async (req, res) => {
  try {
    const profesor = await Profesor.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
    });

    res.status(200).json(profesor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/profesor", async (req, res) => {
  try {
    await Profesor.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "Profesor eliminado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Curso
app.post("/course", async (req, res) => {
  const course = new Course({
    nombre: req.body.nombre,
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
    profesorId: req.body.profesorId,
  });

  try {
    const courseCreated = await course.save();
    res.header("Location", `/course?id=${courseCreated._id}`);
    res.status(201).json(courseCreated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/course", async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Course.find().populate("profesorId");
      return res.status(200).json(data);
    }

    const data = await Course.findById(req.query.id).populate("profesorId");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/course", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
    });

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/course", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "Curso eliminado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(3001, () => console.log("UTN API service listening on port 3001!"));

# Repositorio API

## Desarrollado por Joseph Matsui Rivera Moraga

Introducción

Este repositorio contiene el backend de TicoAutos, desarrollado con Node.js, Express y MongoDB. Se encarga de la autenticación, gestión de vehículos, filtros, y el sistema de preguntas y respuestas.

En este repositorio vamos a manejar nuestro backend que se encuentra en:
https://github.com/matsuijr/API

Cómo ejecutar el proyecto

1. Clonar el repositorio

2. Instalar dependencias:

npm install

3. Ejecutar en modo desarrollo:

npm run dev

o

node index.js

## Rutas principales

POST /api/auth/register → Registro de usuario

POST /api/auth/login → Login y obtención de token

POST /api/vehiculos → Crear vehículo

GET /api/vehiculos → Listar vehículos con filtros

GET /api/vehiculos/mis → Listar vehículos del usuario autenticado

DELETE /api/vehiculos/:id → Eliminar vehículo

PATCH /api/vehiculos/:id/estado → Marcar como vendido

POST /api/preguntas/vehiculos/:id/preguntas → Crear pregunta

POST /api/respuestas/preguntas/:id/respuestas → Crear respuesta

GET /api/conversacion/vehiculos/:id/conversacion → Historial de chat

## Modelos

Usuario: nombre, correo, contraseña

Vehiculo: marca, modelo, año, precio, estado, propietario, imágenes

Pregunta: texto, fecha, usuario, vehiculo, respondida

Respuesta: texto, fecha, usuario, pregunta

## Seguridad

Todas las rutas protegidas requieren el header:

Authorization: Bearer <token generado por jwt>

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const puerto = process.env.PORT || 4000;

app.listen(puerto, () => console.log(`Api levantada en ${puerto}`));

const authMiddleware = (req, res, next) => {
  if (!req.header("Authorization")) {
    const nuevoError = new Error("Petición no autentificada");
    nuevoError.codigo = 403;
    return next(nuevoError);
  }
  const token = req.header("Authorization").split(" ")[1];
  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = datosToken;
    req.idUsuario = id;
    next();
  } catch (e) {
    // Token incorrecto
    if (e.message.includes("expired")) {
      const nuevoError = new Error("Token caducado");
      nuevoError.codigo = 403;
      return next(nuevoError);
    }
    next(e);
  }
};

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("tamo activo");
});

app.use((err, req, res, next) => {
  const codigo = err.codigo || 500;
  const mensaje = err.codigo ? err.message : "Pete general";
  console.log(err.message);
  res.status(codigo).json({ error: true, mensaje });
});

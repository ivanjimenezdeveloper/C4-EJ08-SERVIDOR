require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { loginUsuario } = require("./db/controllers/user");
const { itemsPorUserId } = require("./db/controllers/items");

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
    const id = datosToken.usuario._id;
    req.idUsuario = id;
    next();
  } catch (e) {
    // Token incorrecto
    if (e.message.includes("expired")) {
      const nuevoError = new Error("Token caducado");
      nuevoError.codigo = 403;
      return next(nuevoError);
    } else {
      const nuevoError = new Error("Token erroeno");
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
  res.json({ mensaje: "tamo activo" });
});

app.put("/usuarios/login", async (req, res, next) => {
  const { user, pass } = req.body;

  const resultadoUsuario = await loginUsuario(user, pass);

  if (!resultadoUsuario) {
    const err = new Error("el nombre de usuario o contraseña no coincide");
    err.codigo = 400;
    next(err);
  } else {
    const token = jwt.sign(
      { usuario: resultadoUsuario },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    res.json({ token });
  }
});

app.get("/items/listado", authMiddleware, async (req, res, next) => {
  const id = req.idUsuario;
  const items = await itemsPorUserId(id);
  res.json(items);
});

app.use((err, req, res, next) => {
  const codigo = err.codigo || 500;
  const mensaje = err.codigo ? err.message : "Pete general";
  console.log(err.message);
  res.status(codigo).json({ error: true, mensaje });
});

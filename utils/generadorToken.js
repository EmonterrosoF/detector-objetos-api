import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

// utilidad para generar el token para mantener la sesion del usuario
const generateToken = (id, correo) => {
  return jwt.sign({ id, correo }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;

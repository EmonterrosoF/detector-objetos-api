import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import mssql from "mssql";
import { SP_LOGIN_USUARIO } from "../utils/sp.js";

// middleware que me permite verificar que el usuario este logueado
export const estaLogueado = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      const request = new mssql.Request();

      request.input("correo", mssql.VarChar(30), decoded.correo);

      request.execute(SP_LOGIN_USUARIO, async (err, result) => {
        if (err) {
          console.error(`Error en el sp ${SP_LOGIN_USUARIO}:`, err);
          const error = new Error("Error interno  del servidor");
          return next(error);
        }
        const resultado = result.recordset[0];

        console.log(resultado);
        if (resultado?.usuarioExistente === 0) {
          res.status(400);
          const error = new Error(
            "Usuario no encontrado, pero el token es válido"
          );
          res.clearCookie("token");
          return next(error);
        }
        req.usuario = resultado;
        next();
      });
    } catch (error) {
      console.error(error);
      res.status(401);
      console.log(error.message);
      const err = new Error("El token es inválido");
      res.clearCookie("token");
      next(err);
    }
  }
  if (!token) {
    res.status(401);
    const error = new Error("no existe el token");
    res.clearCookie("token");
    next(error);
  }
};

// // middleware que me permite verificar que el usuario es admin
// export const admin = (req, res, next) => {
//   if (req.user && req.user.isAdmin) {
//     next();
//   } else {
//     res.status(401);
//     const error = new Error("Solo personal Autorizado");
//     next(error);
//   }
// };

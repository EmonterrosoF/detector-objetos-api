import mssql from "mssql";
import { SP_REGISTRAR_USUARIO, SP_LOGIN_USUARIO } from "../utils/sp.js";
import bcrypt from "bcryptjs";
import generadorToken from "../utils/generadorToken.js";

export const registrarUsuario = async (req, res, next) => {
  const { nombre, apellido, correo, contraseña: pass } = req.body;

  const request = new mssql.Request();

  // encriptacion de contraseña
  const salt = await bcrypt.genSalt(10);
  const contraseña = await bcrypt.hash(pass, salt);

  request.input("nombre", mssql.VarChar(20), nombre);
  request.input("apellido", mssql.VarChar(20), apellido);
  request.input("correo", mssql.VarChar(30), correo);
  request.input("contraseña", mssql.VarChar(60), contraseña);

  request.execute(SP_REGISTRAR_USUARIO, (err, result) => {
    if (err) {
      console.error(`Error en el sp ${SP_REGISTRAR_USUARIO}:`, err);
      const error = new Error("Error interno  del servidor");
      return next(error);
    }

    const resultado = result.recordset[0];
    console.dir(result.recordset[0]);

    if (resultado?.usuarioExistente) {
      res.status(400);
      const error = new Error("Ya existe un usuario asociado al correo");
      return error;
    }

    // Guardar el token en una cookie
    res.cookie("token", generadorToken(usuario.id, usuario.correo), {
      httpOnly: true, // Asegura que la cookie no esté disponible para el JavaScript del lado del cliente
      secure: process.env.NODE_ENV === "production", // Solo se envía a través de HTTPS en producción
      maxAge: 30 * 24 * 60 * 60 * 1000, // La cookie expira en 30 día
    });

    res.json(resultado);
  });
};

export const loginUsuario = async (req, res, next) => {
  const { correo, contraseña: pass } = req.body;

  const request = new mssql.Request();

  request.input("correo", mssql.VarChar(30), correo);

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
      const error = new Error("Usuario o Contraseña son incorrectos");
      return next(error);
    }
    const esIgual = await bcrypt.compare(pass, resultado.contraseña);
    // comparar contraseña
    if (!esIgual) {
      res.status(400);
      const error = new Error("Usuario o Contraseña son incorrectos");
      return next(error);
    }

    console.dir(result.recordset[0]);
    const { contraseña, ...usuario } = resultado;

    // Guardar el token en una cookie
    res.cookie("token", generadorToken(usuario.id, usuario.correo), {
      httpOnly: true, // Asegura que la cookie no esté disponible para el JavaScript del lado del cliente
      secure: process.env.NODE_ENV === "production", // Solo se envía a través de HTTPS en producción
      maxAge: 30 * 24 * 60 * 60 * 1000, // La cookie expira en 30 día
    });

    res.json(usuario);
  });
};

import { Router } from "express";
import {
  registrarUsuario,
  loginUsuario,
} from "../controllers/authController.js";
import { estaLogueado } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/registro", registrarUsuario);
authRouter.post("/login", loginUsuario);

export default authRouter;

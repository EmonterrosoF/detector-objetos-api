import { config } from "dotenv";

config();

// PUERTO
export const PORT = process.env.PORT ?? 3000;

// SECRETO PARA JSONWEBTOKEN
export const JWT_SECRET = process.env.JWT_SECRET;

// CREDENCIALES PARA SQL SERVER
export const USER = process.env.USER;
export const PASS = process.env.PASS;
export const SERVER = process.env.SERVER;
export const DB = process.env.DB;

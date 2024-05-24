import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import { manejadorError, noEncontrado } from "./middleware/error.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.use("/api/auth", authRoute);

// manejador de errores
app.use(noEncontrado);
app.use(manejadorError);

export default app;

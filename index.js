import { PORT } from "./config.js";
import app from "./app.js";
import { dbSqlServer } from "./data/dbConexion.js";
import mssql from "mssql";

dbSqlServer();

// Al finalizar la aplicación o el proceso, cerrar el pool de conexiones
process.on("exit", () => {
  try {
    mssql.close();
    console.log("pool de conexiones de SQL SERVER cerrado");
  } catch (error) {
    console.log("Error en cerrar el Pool de Conexiones de MSSQL: " + error);
  }
});

app.listen(PORT, console.log(`server ejecutandose en el puerto ${PORT}`));

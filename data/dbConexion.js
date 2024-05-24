import mssql from "mssql";
import { DB, PASS, SERVER, USER } from "../config.js";

const config = {
  user: USER, // Database username
  password: PASS, // Database password
  server: SERVER, // Server IP address
  database: DB, // Database name
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // Disable encryption
  },
};

export const dbSqlServer = () => {
  // Conexion a SQL Server
  mssql.connect(config, async (err) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log("Conexion exitosa a SQL Server!");
  });
};

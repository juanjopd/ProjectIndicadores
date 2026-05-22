import app from "./src/app.js";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";

import "./src/models/index.js";

import { runSeed } from "./src/services/seed.service.js";

import { seedIndicators }
from "./src/seeders/indicator.seed.js";

dotenv.config();

// ========================================
// MANEJO GLOBAL DE ERRORES
// ========================================

process.on(
  "unhandledRejection",
  (reason) => {

    console.log(
      "UNHANDLED REJECTION:",
      reason
    );

  }
);

process.on(
  "uncaughtException",
  (err) => {

    console.log(
      "UNCAUGHT EXCEPTION:",
      err
    );

  }
);

const PORT =
  process.env.PORT || 4000;

async function startServer() {

  try {

    await sequelize.authenticate();

    console.log(
      "Base de datos conectada"
    );

    // ========================================
    // IMPORTANTE
    // QUITAR alter:true
    // ========================================

    await sequelize.sync();

    console.log(
      "Tablas sincronizadas"
    );

    await seedIndicators();

    await runSeed();

    app.listen(PORT, () => {

      console.log(
        `Servidor corriendo en puerto ${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "Error conectando base de datos",
      error
    );

  }

}

startServer();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes
from "./routes/user.routes.js";
import authRoutes
from "./routes/auth.routes.js";
import entityRoutes
from "./routes/entity.routes.js";
import indicatorRoutes
from "./routes/indicator.routes.js";
import indicatorDataRoutes
from "./routes/indicatorData.routes.js";
import reportRoutes
from "./routes/report.routes.js";
import "./models/index.js";
import notificationRoutes
from './routes/notification.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// CORS
// ========================================

app.use(

  cors({

    origin:
      "http://localhost:3000",

    credentials: true,

  })

);

// ========================================
// MIDDLEWARES
// ========================================

app.use(express.json());

app.use(cookieParser());

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, '../uploads')
  )
);

// ========================================
// RUTA TEST
// ========================================

app.get("/", (req, res) => {

  res.json({
    message: "API funcionando"
  });

});

// ========================================
// RUTAS
// ========================================

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/entity",
  entityRoutes
);

app.use(
  "/api/indicator",
  indicatorRoutes
);

app.use(
  "/api/indicator-data",
  indicatorDataRoutes
);

app.use(
  "/api/report",
  reportRoutes
);

// ========================================
// MANEJO GLOBAL DE ERRORES
// ========================================

app.use(
  (err, req, res, next) => {

    console.log(err);

    res.status(500).json({

      message:
        "Error interno del servidor"

    });

  }
);

// ========================================
// NOTIFICACIONES
// ========================================

app.use(
  '/api/notifications',
  notificationRoutes
);

export default app;
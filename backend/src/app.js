import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";


const app = express();

// Middlewares globales
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true
	})
);
app.use(express.json());
app.use(cookieParser())

//ruta de prueba
app.get("/", (req, res) => {
	res.json({ message: "API funcionando" });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/entity", authRoutes);



export default app; 

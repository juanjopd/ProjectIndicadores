import app from "./src/app.js";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";
import "./src/models/index.js";
import { runSeed } from "./src/services/seed.service.js";
import { seedIndicators } from "./src/seeders/indicator.seed.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
	try {
		await sequelize.authenticate();
		console.log("Base de datos conectada");
		
		await sequelize.sync({ alter: true });
		await seedIndicators();
		console.log("Tablas sincronizadas");
		
		await runSeed();

		app.listen(PORT, () => {
			console.log(`Servidor corriendo en puerto ${PORT}`);
		});
	} catch (error) {
		console.log("Error al contenar la base de datos", error);
	}
}

startServer();

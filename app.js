import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./src/db/database.js";
import seedUsers from "./src/utils/seedUsers.js";
import dotenv from "dotenv";
dotenv.config(); // carga las variables desde .env

//rutas
import homeRoutes from "./src/routes/home.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import frontendRoutes from "./src/routes/frontend.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src","views"));

// Middlewares
app.use(express.urlencoded({ extended: true })); // Para leer datos de formularios
app.use(express.json()); // Para leer JSON
app.use(express.static(path.join(__dirname,"src", "public"))); // Archivos estáticos (css, js, imgs)

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/", frontendRoutes);
app.use("/posts", postRoutes);

// Error handling middleware
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página No Encontrada' });
});

const startServer = async () => {
  try {
    await connectDB();
    await seedUsers();
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

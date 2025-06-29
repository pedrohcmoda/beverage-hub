import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth.js";
import drinkRoutes from "./routes/drinkRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";
import compression from "compression";

const app = express();
app.set("trust proxy", 1);
app.use(compression());

// app.use(
//   cors({
//     origin: '*',
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://138.97.132.151:5173",
      "http://179.154.179.162:5173",
      "https://beverage-pouxca21y-pedrohcmodas-projects.vercel.app",
      "https://beverage-hub.vercel.app",
      "https://backend-cold-violet-7320.fly.dev",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("public/uploads"), { maxAge: "7d" }));

app.use("/api/auth", authRoutes);
app.use("/api/drinks", drinkRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/ingredients", ingredientRoutes);

app.get("/", (req, res) => res.send("API ok"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth.js";
import drinkRoutes from "./routes/drinkRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";
import compression from "compression";
import { globalLimiter } from "./config/globalRateLimit.js";
import { sanitizeBody } from "./config/sanitizer.js";

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
      "http://localhost:5174",
      "https://localhost:5173",
      "https://localhost:5174",
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

app.use(globalLimiter);
app.use(sanitizeBody);

app.use("/api/auth", authRoutes);
app.use("/api/drinks", drinkRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/ingredients", ingredientRoutes);

app.get("/", (req, res) => res.send("API ok"));

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

const certPath = path.resolve("selfsigned.crt");
const keyPath = path.resolve("selfsigned.key");

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

https.createServer(httpsOptions, app).listen(HTTPS_PORT, "0.0.0.0", () => {
  console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
  console.log(`Access: https://localhost:${HTTPS_PORT}`);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP Server running on port ${PORT}`);
  console.log(`Access: http://localhost:${PORT}`);
});

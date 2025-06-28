import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import drinkRoutes from "./routes/drinkRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/drinks", drinkRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => res.send("API ok"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on :${PORT}`);
});

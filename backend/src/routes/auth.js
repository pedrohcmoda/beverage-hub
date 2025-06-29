import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../config/hash.js";
import { authenticateJWT } from "../config/auth.js";
import { sanitizeBody } from "../config/sanitizer.js";
import { loginLimiter } from "../config/rateLimit.js";
import { logEvent } from "../config/logger.js";
import { findUserByEmail, createUser, findUserById } from "../models/user.js";

const router = express.Router();
const prisma = new PrismaClient();

function getCookieDomain() {
  if (process.env.NODE_ENV === "production") {
    return "beverage-pouxca21y-pedrohcmodas-projects.vercel.app";
  }
  return "localhost";
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    domain: getCookieDomain(),
    path: "/",
  });
}

router.post("/register", sanitizeBody, async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    logEvent(`Register failed: missing fields for ${email || "unknown"}`);
    return res.status(400).json({ error: "All fields are required." });
  }

  const exists = await findUserByEmail(email);
  if (exists) {
    logEvent(`Register failed: email exists ${email}`);
    return res.status(409).json({ error: "Email already exists." });
  }

  const hashed = await hashPassword(password);
  const user = await createUser({ email, password: hashed, name });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  setAuthCookie(res, token);

  logEvent(`User registered: ${email}`);
  res.json({ id: user.id, email: user.email, name: user.name });
});

router.post("/login", loginLimiter, sanitizeBody, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    logEvent(`Login failed: missing fields for ${email || "unknown"}`);
    return res.status(400).json({ error: "All fields are required." });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    logEvent(`Login failed: user not found ${email}`);
    return res.status(401).json({ error: "Invalid Credentials" });
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    logEvent(`Login failed: invalid password for ${email}`);
    return res.status(401).json({ error: "Invalid Credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  setAuthCookie(res, token);

  logEvent(`Login success: ${email}`);
  res.json({ id: user.id, email: user.email, name: user.name });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { domain: getCookieDomain(), path: "/" });
  logEvent(`Logout`);
  res.json({ ok: true });
});

router.get("/me", authenticateJWT, async (req, res) => {
  const user = await findUserById(req.user.id);
  if (!user) {
    logEvent(`/me failed: user not found id=${req.user.id}`);
    return res.status(404).json({ error: "User Not Found!" });
  }
  res.json({ id: user.id, email: user.email, name: user.name });
});

export default router;

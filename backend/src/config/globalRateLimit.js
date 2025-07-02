import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, try again later." },
});

export const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://backend-cold-violet-7320.fly.dev"
    : "http://localhost:3000";

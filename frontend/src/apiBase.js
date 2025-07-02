export const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://backend-cold-violet-7320.fly.dev"
    : "https://localhost:3443";

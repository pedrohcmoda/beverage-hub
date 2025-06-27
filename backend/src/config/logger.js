import fs from "fs";
export function logEvent(event) {
  fs.appendFileSync("server.log", `[${new Date().toISOString()}] ${event}\n`);
}

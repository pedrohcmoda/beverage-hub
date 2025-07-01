import { logger as winstonLogger } from "./winstonLogger.js";
export function logEvent(event) {
  winstonLogger.info(event);
}

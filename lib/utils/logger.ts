import fs from "fs";
import path from "path";

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

// Ensure the log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Writes a structured log entry to both console and file
 */
export function log(level: LogLevel, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data }),
  };

  const serialized = JSON.stringify(logEntry);

  // 1️⃣ Console output
  switch (level) {
    case LogLevel.ERROR:
      console.error(serialized);
      break;
    case LogLevel.WARN:
      console.warn(serialized);
      break;
    default:
      console.log(serialized);
  }

  // 2️⃣ Append to file asynchronously
  fs.appendFile(LOG_FILE, serialized + "\n", (err) => {
    if (err) console.error("Failed to write log file:", err);
  });
}

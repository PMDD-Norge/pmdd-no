/**
 * Logging Utility
 * Centralizes logging to avoid console.* statements throughout the codebase
 * Allows for easy integration with external logging services in the future
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

/**
 * Determines if logging should be enabled based on environment
 */
const isLoggingEnabled = (): boolean => {
  return process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_LOGGING === "true";
};

/**
 * Logs a message with optional context
 * In production, this could be extended to send logs to external services
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!isLoggingEnabled() && level !== "error") {
    return;
  }

  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level,
    message,
    ...context,
  };

  // In development, use console
  if (process.env.NODE_ENV === "development") {
    switch (level) {
      case "debug":
        console.debug(`[${timestamp}] DEBUG:`, message, context);
        break;
      case "info":
        console.info(`[${timestamp}] INFO:`, message, context);
        break;
      case "warn":
        console.warn(`[${timestamp}] WARN:`, message, context);
        break;
      case "error":
        console.error(`[${timestamp}] ERROR:`, message, context);
        break;
    }
  } else {
    // In production, always log errors
    // You could integrate with services like Sentry, LogRocket, etc.
    if (level === "error") {
      console.error(JSON.stringify(logData));
      // Example: sentryLog(logData);
    }
  }
}

/**
 * Logger object with convenience methods
 */
export const logger = {
  debug: (message: string, context?: LogContext) => log("debug", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),
};

/**
 * Helper to log errors with stack trace
 */
export function logError(error: unknown, context?: LogContext): void {
  if (error instanceof Error) {
    logger.error(error.message, {
      ...context,
      stack: error.stack,
      name: error.name,
    });
  } else {
    logger.error("Unknown error occurred", {
      ...context,
      error: String(error),
    });
  }
}

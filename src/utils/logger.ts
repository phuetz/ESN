/**
 * Frontend Logger Service
 * Provides structured logging with different levels and environment-aware output
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  context?: string;
}

class Logger {
  private isDevelopment: boolean;
  private enableConsole: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.enableConsole = this.isDevelopment || import.meta.env.VITE_ENABLE_LOGGING === 'true';
  }

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, context, message } = entry;
    const contextStr = context ? `[${context}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    context?: string
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    };
  }

  private log(entry: LogEntry): void {
    if (!this.enableConsole) {
      return;
    }

    const formattedMessage = this.formatMessage(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.data || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, entry.data || '');
        if (entry.data instanceof Error) {
          console.error(entry.data.stack);
        }
        break;
    }

    // In production, you could send logs to a logging service here
    if (!this.isDevelopment && entry.level === LogLevel.ERROR) {
      this.sendToLoggingService(entry);
    }
  }

  private sendToLoggingService(entry: LogEntry): void {
    // Placeholder for external logging service integration
    // e.g., Sentry, LogRocket, etc.
    // This would be implemented based on your logging service
  }

  debug(message: string, data?: any, context?: string): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, data, context);
    this.log(entry);
  }

  info(message: string, data?: any, context?: string): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, data, context);
    this.log(entry);
  }

  warn(message: string, data?: any, context?: string): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, data, context);
    this.log(entry);
  }

  error(message: string, error?: Error | any, context?: string): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, error, context);
    this.log(entry);
  }

  // Utility method to create a logger with a specific context
  withContext(context: string): ContextLogger {
    return new ContextLogger(this, context);
  }
}

// Context-aware logger for specific modules
class ContextLogger {
  constructor(
    private logger: Logger,
    private context: string
  ) {}

  debug(message: string, data?: any): void {
    this.logger.debug(message, data, this.context);
  }

  info(message: string, data?: any): void {
    this.logger.info(message, data, this.context);
  }

  warn(message: string, data?: any): void {
    this.logger.warn(message, data, this.context);
  }

  error(message: string, error?: Error | any): void {
    this.logger.error(message, error, this.context);
  }
}

// Export a singleton instance
const logger = new Logger();

export default logger;

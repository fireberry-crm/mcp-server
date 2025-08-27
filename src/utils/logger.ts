import { env } from '../env.js';
/**
 * Simple logging utility for the MCP server
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
} as const satisfies Record<LogLevel, number>;

const logMethods: Record<LogLevel, (message: unknown, ...args: unknown[]) => void> =
    env.TRANSPORT === 'stdio'
        ? {
              debug: console.error,
              info: console.error,
              warn: console.error,
              error: console.error,
          }
        : {
              debug: console.debug,
              info: console.info,
              warn: console.warn,
              error: console.error,
          };

class Logger {
    private level: LogLevel;

    constructor(level: LogLevel = 'info') {
        this.level = level;
    }

    private shouldLog(level: LogLevel): boolean {
        return levels[level] >= levels[this.level];
    }
    get date(): string {
        return new Date().toISOString().split('T').join(' ').split('Z').join('');
    }
    debug(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            logMethods.debug(`${this.date} [DEBUG] ${message}`, ...args);
        }
    }

    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            logMethods.info(`${this.date} [INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            logMethods.warn(`${this.date} [WARN] ${message}`, ...args);
        }
    }

    error(message: string, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            logMethods.error(`${this.date} [ERROR] ${message}`, ...args);
        }
    }
}

// Create default logger instance
const logger = new Logger(env.LOG_LEVEL);

export { logger };

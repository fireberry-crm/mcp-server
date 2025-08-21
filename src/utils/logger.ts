import { env } from '../env.js';
/**
 * Simple logging utility for the MCP server
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
    private level: LogLevel;

    constructor(level: LogLevel = 'info') {
        this.level = level;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
        } as const satisfies Record<LogLevel, number>;
        return levels[level] >= levels[this.level];
    }

    debug(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            console.warn(`[DEBUG] ${message}`, ...args);
        }
    }

    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            console.warn(`[INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    error(message: string, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }
}

// Create default logger instance
const logger = new Logger(env.LOG_LEVEL);

export { logger };

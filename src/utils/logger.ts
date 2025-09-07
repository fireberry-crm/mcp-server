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

export interface Logger {
    debug(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
}

class StdioLogger implements Logger {
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
            console.error(`${this.date} [DEBUG] ${message}`, ...args);
        }
    }

    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            console.error(`${this.date} [INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            console.error(`${this.date} [WARN] ${message}`, ...args);
        }
    }

    error(message: string, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            console.error(`${this.date} [ERROR] ${message}`, ...args);
        }
    }
}

// Create default logger instance
const logger = new StdioLogger(env.LOG_LEVEL);

export { logger };

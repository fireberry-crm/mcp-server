#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { env } from './env.js';
import { createServer } from './server.js';
import { logger } from './utils/index.js';

logger.info('Starting Fireberry MCP Server (stdio)...');

export async function main() {
    const transport = new StdioServerTransport();
    const { server, cleanup } = createServer(env.FIREBERRY_TOKEN_ID);

    await server.connect(transport);

    // Cleanup on exit
    process.on('SIGINT', () => {
        logger.info('Received SIGINT, shutting down...');
        cleanup()
            .then(() => {
                process.exit(0);
            })
            .catch((error: unknown) => {
                logger.error('Error closing server:', error);
                process.exit(1);
            });
    });

    process.on('SIGTERM', () => {
        logger.info('Received SIGTERM, shutting down...');
        cleanup()
            .then(() => {
                process.exit(0);
            })
            .catch((error: unknown) => {
                logger.error('Error closing server:', error);
                process.exit(1);
            });
    });
}

#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { logger } from './utils/index.js';

logger.info('Starting Fireberry MCP Server (stdio)...');

async function main() {
    const transport = new StdioServerTransport();
    const { server, cleanup } = createServer();

    await server.connect(transport);

    // Cleanup on exit
    process.on('SIGINT', () => {
        logger.info('Received SIGINT, shutting down...');
        cleanup();
        server
            .close()
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
        cleanup();
        server
            .close()
            .then(() => {
                process.exit(0);
            })
            .catch((error: unknown) => {
                logger.error('Error closing server:', error);
                process.exit(1);
            });
    });
}
main().catch((error: unknown) => {
    logger.error('Server error:', error);
    process.exit(1);
});

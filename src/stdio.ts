#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { createServer } from './server.js';
import { logger } from './utils/index.js';

export async function main() {
    logger.info('Starting Fireberry MCP Server (stdio)...');

    const transport = new StdioServerTransport();

    const envResult = z.object({ FIREBERRY_TOKEN_ID: z.uuid() }).safeParse(process.env);

    if (!envResult.success) {
        logger.error('Environment validation failed:', z.treeifyError(envResult.error));
        process.exit(1);
    }

    const { server, cleanup } = createServer(envResult.data.FIREBERRY_TOKEN_ID, logger);

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

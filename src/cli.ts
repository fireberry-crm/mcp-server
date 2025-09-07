#!/usr/bin/env node

import { main } from './stdio.js';
import { type ToolsBundle, toolsBundleSchema, TOOLS_BUNDLES } from './constants.js';
import { logger } from './utils/index.js';

import { z } from 'zod';

const flagSchema = z
    .string()
    .startsWith('--')
    .transform((arg) => arg.slice(2))
    .pipe(toolsBundleSchema);

function parseToolsBundle(): ToolsBundle {
    const rawArg = process.argv[2];

    // Default to 'all' if no argument provided
    if (!rawArg) {
        return TOOLS_BUNDLES.all;
    }

    const validationResult = flagSchema.safeParse(rawArg);

    if (!validationResult.success) {
        logger.error(`Invalid tools bundle '${rawArg}'. Valid options: ${Object.values(TOOLS_BUNDLES).join(', ')}`);
        process.exit(1);
    }

    return validationResult.data;
}

const toolsBundle = parseToolsBundle();
main({ toolsBundle }).catch((error: unknown) => {
    logger.error('Server error:', error);
    process.exit(1);
});

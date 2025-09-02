import { main } from './stdio.js';
import { logger } from './utils/index.js';

main().catch((error: unknown) => {
    logger.error('Server error:', error);
    process.exit(1);
});

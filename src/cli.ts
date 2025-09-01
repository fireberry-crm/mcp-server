import { main } from './stdio.js';
import { logger } from './utils/index.js';

const isMain = import.meta.url.includes(process.argv[1] ?? import.meta.url + '#not main');

if (isMain) {
    main().catch((error: unknown) => {
        logger.error('Server error:', error);
        process.exit(1);
    });
}

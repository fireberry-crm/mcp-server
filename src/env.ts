import { z } from 'zod';

// Conditionally load dotenv only in development
if (process.env.NODE_ENV !== 'production') {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (['debug', 'info'].includes(process.env.LOG_LEVEL)) console.info('dotenv available, loading .env file');
        await import('dotenv/config');
    } catch {
        // dotenv is optional, silently continue if not available
        if (process.env.LOG_LEVEL === 'debug') console.debug('dotenv not available, skipping .env file loading');
    }
}

const envSchema = z.object({
    BASE_URL: z.url().default('https://api.fireberry.com'),
    FIREBERRY_TOKEN_ID: z.uuid(),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const envResult = envSchema.safeParse(process.env);
if (!envResult.success) {
    console.error('Environment validation failed:', z.treeifyError(envResult.error));
    process.exit(1);
}
export const env = envResult.data;

import { z } from 'zod';

// Conditionally load dotenv only in development
if (process.env.NODE_ENV !== 'production') {
    try {
        // Dynamic import for optional dependency
        await import('dotenv/config');
    } catch {
        // dotenv is optional, silently continue if not available
        console.warn('dotenv not available, skipping .env file loading');
    }
}

const envSchema = z.object({
    BASE_URL: z.url().default('https://api.fireberry.com'),
    TOKEN_ID: z.uuid(),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const envResult = envSchema.safeParse(process.env);
if (!envResult.success) {
    console.error('Environment validation failed:', z.treeifyError(envResult.error));
    process.exit(1);
}
export const env = envResult.data;

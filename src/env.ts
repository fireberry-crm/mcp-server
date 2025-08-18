import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
    BASE_URL: z.url().default('https://api.fireberry.com'),
    TOKEN_ID: z.string().min(1),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export const env = envSchema.parse(process.env);

export default env;

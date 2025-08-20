import { z } from 'zod';
import type { ToolSchema } from '../types';

export function zodToJsonSchema<T extends z.ZodObject>(schema: T): ToolSchema<T> {
    return z.toJSONSchema(schema) as ToolSchema<T>;
}

import type { z } from 'zod';

export type ToolSchema<T extends z.ZodObject> = ReturnType<typeof z.toJSONSchema<T>>;

export type AutocompleteString<T extends string> = T & Record<never, never>;

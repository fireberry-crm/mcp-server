import { z } from 'zod';
import type { ToolSchema } from '../types/index.js';

// Recursively ensure object schemas reject unknown properties. Zod 4 only
// emits `additionalProperties: false` in `output` mode; we generate with
// `io: 'input'` (so defaulted fields are correctly optional in the input
// JSON Schema), then re-add the strict flag for MCP tool input validation.
function setAdditionalPropertiesFalse(node: unknown): void {
    if (Array.isArray(node)) {
        for (const item of node) setAdditionalPropertiesFalse(item);
        return;
    }
    if (!node || typeof node !== 'object') return;
    const obj = node as Record<string, unknown>;
    if (obj.type === 'object' && !('additionalProperties' in obj)) {
        obj.additionalProperties = false;
    }
    for (const value of Object.values(obj)) setAdditionalPropertiesFalse(value);
}

export function zodToJsonSchema<T extends z.ZodObject>(schema: T): ToolSchema<T> {
    const json = z.toJSONSchema(schema, { io: 'input' });
    setAdditionalPropertiesFalse(json);
    return json;
}

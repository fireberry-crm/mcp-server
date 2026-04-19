import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

// `ReturnType<typeof z.toJSONSchema<T>>` is `ZodStandardJSONSchemaPayload`, which
// is wider than what the MCP SDK's `Tool['inputSchema']` accepts: zod allows
// `properties[k]` to be `boolean` (JSON Schema's always-pass / always-fail
// sub-schema), the SDK requires `object`. Intersect with `Tool['inputSchema']`
// so callers get a type that's directly assignable to a tool definition.
export type ToolSchema<T extends z.ZodObject> = ReturnType<typeof z.toJSONSchema<T>> & Tool['inputSchema'];

export type AutocompleteString<T extends string> = T & Record<never, never>;

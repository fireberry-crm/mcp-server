import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

// `z.toJSONSchema` returns `z.core.JSONSchema.BaseSchema`, which is wider than
// what the MCP SDK's `Tool['inputSchema']` accepts: zod allows `properties[k]`
// to be `boolean` (JSON Schema's always-pass / always-fail sub-schema), the SDK
// requires `object`. Intersect with `Tool['inputSchema']` so callers get a type
// that's directly assignable to a tool definition. Note: `z.toJSONSchema` is an
// overloaded, non-generic function, so it can't take a `<T>` type argument — the
// generated schema isn't statically typed by the input schema either way.
export type ToolSchema = z.core.JSONSchema.BaseSchema & Tool['inputSchema'];

export type AutocompleteString<T extends string> = T & Record<never, never>;

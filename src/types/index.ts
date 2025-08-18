import type z from 'zod';

/**
 * Shared types for the Fireberry CRM MCP Server
 */
export type ConvertZodObjectToJsonSchema<T extends z.ZodObject> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema';
    type: T['type'];
    properties: {
        [K in keyof T['shape']]: {
            description: T['shape'][K]['description'];
            type: T['shape'][K]['type'] extends z.ZodOptional<infer U> ? U | undefined : T['shape'][K]['type'];
        };
    };
    additionalProperties: boolean;
};

export type ToolSchema<T extends z.ZodObject> = ConvertZodObjectToJsonSchema<T> & z.core.JSONSchema.ObjectSchema;

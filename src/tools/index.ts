import z from 'zod';
import { zodToJsonSchema } from '../utils/index.js';
import { ToolNames } from '../constants.js';

export const metadataObjectsSchema = z.object({});
export const metadataFieldsSchema = z.object({
    objectType: z
        .string()
        .regex(/^\d+$/, { message: 'objectType must be a string containing only digits' })
        .describe('The object type to get metadata for'),
});
export const metadataPicklistSchema = z.object({
    objectType: z
        .string()
        .regex(/^\d+$/, { message: 'objectType must be a string containing only digits' })
        .describe('The object type to get metadata for'),
    fieldName: z.string().describe('The picklist field name to get the values for'),
});
export const recordCreateSchema = z.object({
    objectType: z.string().describe('The object type to create a record for'),
    fields: z.record(z.string(), z.unknown()).describe('The fields to create the record with'),
});
export const recordUpdateSchema = z.object({
    objectType: z.string().describe('The object type to update a record for'),
    recordId: z.uuid().describe('The id of the record to update'),
    fields: z.record(z.string(), z.unknown()).describe('The fields to update the record with'),
});
/**
 * Register all tools and return the tools list
 */
export async function registerTools() {
    return Promise.resolve({
        tools: [
            {
                name: ToolNames.metadataObjects,
                description: 'get all fireberry crm object types',
                inputSchema: zodToJsonSchema(metadataObjectsSchema),
            },
            {
                name: ToolNames.metadataFields,
                description: 'get all fields by of a crm object',
                inputSchema: zodToJsonSchema(metadataFieldsSchema),
            },
            {
                name: ToolNames.metadataPicklist,
                description: 'get all picklist options of a picklist type field',
                inputSchema: zodToJsonSchema(metadataPicklistSchema),
            },
            {
                name: ToolNames.recordCreate,
                description: 'create a new crm record from a specified object type',
                inputSchema: zodToJsonSchema(recordCreateSchema),
            },
            {
                name: ToolNames.recordUpdate,
                description: 'update a crm record',
                inputSchema: zodToJsonSchema(recordUpdateSchema),
            },
        ],
    } as const satisfies {
        tools: { name: (typeof ToolNames)[keyof typeof ToolNames]; description: string; inputSchema: object }[];
    });
}

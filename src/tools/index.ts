import { zodToJsonSchema } from '../utils/index.js';
import { ToolNames } from '../constants.js';
import { metadataPicklistSchema, metadataObjectsSchema, metadataFieldsSchema } from './metadata';
import { recordCreateSchema, recordUpdateSchema } from './record';
import { objectCreateSchema } from './object';
import { fieldCreateSchema } from './field';

export {
    metadataPicklistSchema,
    metadataObjectsSchema,
    metadataFieldsSchema,
    recordCreateSchema,
    recordUpdateSchema,
    objectCreateSchema,
    fieldCreateSchema,
};

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
            {
                name: ToolNames.objectCreate,
                description: 'create a new crm object type',
                inputSchema: zodToJsonSchema(objectCreateSchema),
            },
            {
                name: ToolNames.fieldCreate,
                description: 'create a new text field in a crm object',
                inputSchema: zodToJsonSchema(fieldCreateSchema),
            },
        ],
    } as const satisfies {
        tools: { name: (typeof ToolNames)[keyof typeof ToolNames]; description: string; inputSchema: object }[];
    });
}

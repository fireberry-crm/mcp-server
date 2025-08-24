import { zodToJsonSchema } from '../utils/index.js';
import { ToolNames } from '../constants.js';
import { metadataPicklistToolInputSchema, metadataObjectsToolInputSchema, metadataFieldsToolInputSchema } from './metadata/index.js';
import { recordCreateToolInputSchema, recordUpdateToolInputSchema } from './record/index.js';
import { objectCreateToolInputSchema } from './object/index.js';
import { fieldCreateToolInputSchemaForRegister, fieldCreateToolInputSchemaForCall } from './field/index.js';

export {
    metadataPicklistToolInputSchema,
    metadataObjectsToolInputSchema,
    metadataFieldsToolInputSchema,
    recordCreateToolInputSchema,
    recordUpdateToolInputSchema,
    objectCreateToolInputSchema,
    fieldCreateToolInputSchemaForRegister,
    fieldCreateToolInputSchemaForCall,
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
                inputSchema: zodToJsonSchema(metadataObjectsToolInputSchema),
            },
            {
                name: ToolNames.metadataFields,
                description: 'get all fields by of a crm object',
                inputSchema: zodToJsonSchema(metadataFieldsToolInputSchema),
            },
            {
                name: ToolNames.metadataPicklist,
                description: 'get all picklist options of a picklist type field',
                inputSchema: zodToJsonSchema(metadataPicklistToolInputSchema),
            },
            {
                name: ToolNames.recordCreate,
                description: 'create a new crm record from a specified object type',
                inputSchema: zodToJsonSchema(recordCreateToolInputSchema),
            },
            {
                name: ToolNames.recordUpdate,
                description: 'update a crm record',
                inputSchema: zodToJsonSchema(recordUpdateToolInputSchema),
            },
            {
                name: ToolNames.objectCreate,
                description: 'create a new crm object type',
                inputSchema: zodToJsonSchema(objectCreateToolInputSchema),
            },
            {
                name: ToolNames.fieldCreate,
                description: 'create a new text field in a crm object',
                inputSchema: zodToJsonSchema(fieldCreateToolInputSchemaForRegister),
            },
        ],
    } as const satisfies {
        tools: { name: (typeof ToolNames)[keyof typeof ToolNames]; description: string; inputSchema: object }[];
    });
}

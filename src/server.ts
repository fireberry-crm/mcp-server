import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import {
    metadataFieldsSchema,
    metadataPicklistSchema,
    recordCreateSchema,
    recordUpdateSchema,
    objectCreateSchema,
    registerTools,
    fieldCreateSchemaForCall,
} from './tools/registerTools.js';
import { logger } from './utils/index.js';
import { SERVER_DESCRIPTION, SERVER_NAME, ToolNames, VERSION, type ToolName } from './constants.js';
import { fireberryApi } from './services/fireberryApi.js';
import { z } from 'zod';

function safeStringify(data: unknown) {
    try {
        return JSON.stringify(data, null, 2);
    } catch (error) {
        logger.error(error as string);
        return 'Internal server error';
    }
}
function createToolResponse(data: unknown) {
    const isError = typeof data === 'object' && data !== null && 'error' in data && data.error !== undefined;
    return {
        content: [{ type: 'text' as const, text: typeof data === 'string' ? data : isError ? data.error : safeStringify(data) }],
        isError,
    };
}

/** provides the model error context for when the schema for register won't be as strict as the schema to call*/
function createToolResponseParsingError(msg: string, error: z.ZodError) {
    return {
        content: [{ type: 'text' as const, text: `${msg} ${JSON.stringify(z.treeifyError(error), null, 2)}` }],
        isError: true,
    };
}

/**
 * Create and configure the MCP server (shared for both stdio and HTTP)
 */
export function createServer() {
    const server = new Server(
        {
            name: SERVER_NAME,
            title: SERVER_DESCRIPTION,
            version: VERSION,
        } as const,
        {
            capabilities: {
                tools: {},
            },
        } as const
    );

    // Register handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return await registerTools();
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        switch (name as ToolName) {
            case ToolNames.metadataObjects: {
                const metadataObjects = await fireberryApi.getMetadataObjects();
                return createToolResponse(metadataObjects);
            }
            case ToolNames.metadataFields: {
                const parsedArgs = metadataFieldsSchema.safeParse(args);

                if (!parsedArgs.success) return createToolResponseParsingError(`Error parsing object type arguments`, parsedArgs.error);

                const { objectType } = parsedArgs.data;
                const metadataFields = await fireberryApi.getMetadataFields(objectType);
                return createToolResponse(metadataFields);
            }
            case ToolNames.metadataPicklist: {
                const parsedArgs = metadataPicklistSchema.safeParse(args);
                if (!parsedArgs.success) return createToolResponseParsingError(`Error parsing picklist argument`, parsedArgs.error);

                const { objectType, fieldName } = parsedArgs.data;
                const picklist = await fireberryApi.getMetadataPicklist(objectType, fieldName);
                return createToolResponse(picklist);
            }
            case ToolNames.recordCreate: {
                const parsedArgs = recordCreateSchema.safeParse(args);
                if (!parsedArgs.success) return createToolResponseParsingError(`Error parsing record creation arguments`, parsedArgs.error);

                const { objectType, fields } = parsedArgs.data;
                const record = await fireberryApi.createRecord(objectType, fields);
                return createToolResponse(record);
            }
            case ToolNames.recordUpdate: {
                const parsedArgs = recordUpdateSchema.safeParse(args);
                if (!parsedArgs.success) return createToolResponseParsingError(`Error parsing record update arguments`, parsedArgs.error);

                const { objectType, recordId, fields } = parsedArgs.data;
                const record = await fireberryApi.updateRecord(objectType, recordId, fields);
                return createToolResponse(record);
            }
            case ToolNames.objectCreate: {
                const parsedArgs = objectCreateSchema.safeParse(args);
                if (!parsedArgs.success) return createToolResponseParsingError(`Error parsing object creation arguments`, parsedArgs.error);

                const { name, collectionname } = parsedArgs.data;
                const result = await fireberryApi.createObject(name, collectionname);
                return createToolResponse(result);
            }
            case ToolNames.fieldCreate: {
                const parsedArgs = fieldCreateSchemaForCall.safeParse(args);
                if (!parsedArgs.success) return createToolResponseParsingError(`Error parsing field creation arguments`, parsedArgs.error);

                const result = await fireberryApi.createField(parsedArgs.data);
                return createToolResponse(result);
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    });

    // Cleanup function for proper resource management
    const cleanup = () => {
        logger.info('Cleaning up server resources...');
        // Add any cleanup logic here (close database connections, etc.)
    };

    return { server, cleanup };
}
export type FireberryServer = ReturnType<typeof createServer>['server'];

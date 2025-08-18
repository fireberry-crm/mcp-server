import z from 'zod';
import { zodToJsonSchema } from '../utils/index.js';

export const pingSchema = z.object({
    message: z.string().optional().describe('Optional message to echo back'),
});

/**
 * Register all tools and return the tools list
 */
export async function registerTools() {
    return Promise.resolve({
        tools: [
            {
                name: 'ping', //TODO: Example tool for first code review, will be removed later
                description: 'Simple ping tool to test server connectivity',
                inputSchema: zodToJsonSchema(pingSchema),
            },
            {
                name: 'metadata:objects',
                description: 'get all fireberry crm object types',
                //TODO: add schema
                inputSchema: zodToJsonSchema(z.object({})),
            },
            {
                name: 'metadata:fields',
                description: 'get all fields by of a crm object',
                //TODO: add schema
                inputSchema: zodToJsonSchema(z.object({})),
            },
            {
                name: 'metadata:picklist',
                description: 'get all picklist options of a picklist type field',
                //TODO: add schema
                inputSchema: zodToJsonSchema(z.object({})),
            },
            {
                name: 'record:create',
                description: 'create a new crm record from a specified object type',
                //TODO: add schema
                inputSchema: zodToJsonSchema(z.object({})),
            },
        ],
    } as const);
}

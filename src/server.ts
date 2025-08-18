import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { metadataFieldsSchema, metadataPicklistSchema, recordCreateSchema, recordUpdateSchema, registerTools } from './tools/index.js';
import { logger } from './utils/index.js';
import { ToolNames, VERSION, type ToolName } from './constants.js';
import { fireberryApi } from './services/fireberry-api.js';

/**
 * Create and configure the MCP server (shared for both stdio and HTTP)
 */
export function createServer() {
    const server = new Server(
        {
            name: 'fireberry-crm-server',
            title: 'Fireberry CRM MCP Server',
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
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(metadataObjects, null, 2),
                        },
                    ],
                };
            }
            case ToolNames.metadataFields: {
                const parsedArgs = metadataFieldsSchema.safeParse(args);
                if (!parsedArgs.success) return { content: [{ type: 'text', text: 'Error parsing object type argument' }] };
                const { objectType } = parsedArgs.data;
                const metadataFields = await fireberryApi.getMetadataFields(objectType);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(metadataFields, null, 2),
                        },
                    ],
                };
            }
            case ToolNames.metadataPicklist: {
                const parsedArgs = metadataPicklistSchema.safeParse(args);
                if (!parsedArgs.success) return { content: [{ type: 'text', text: 'Error parsing picklist argument' }] };
                const { objectType, fieldName } = parsedArgs.data;
                const picklist = await fireberryApi.getMetadataPicklist(objectType, fieldName);
                return { content: [{ type: 'text', text: JSON.stringify(picklist, null, 2) }] };
            }

            case ToolNames.recordCreate: {
                const parsedArgs = recordCreateSchema.safeParse(args);
                if (!parsedArgs.success) return { content: [{ type: 'text', text: 'Error parsing record creation arguments' }] };
                const { objectType, fields } = parsedArgs.data;
                const record = await fireberryApi.createRecord(objectType, fields);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(record, null, 2),
                        },
                    ],
                };
            }
            case ToolNames.recordUpdate: {
                const parsedArgs = recordUpdateSchema.safeParse(args);
                if (!parsedArgs.success) return { content: [{ type: 'text', text: 'Error parsing record update arguments' }] };
                const { objectType, recordId, fields } = parsedArgs.data;
                const record = await fireberryApi.updateRecord(objectType, recordId, fields);
                return { content: [{ type: 'text', text: JSON.stringify(record, null, 2) }] };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    });
    // TODO: add resources or remove the comment
    /*   server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return await registerResources();
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri === "status://server") {
      const status = {
        name: "fireberry-crm-server",
        version: VERSION,
        status: "running",
        timestamp: new Date().toISOString(),
      };

      return {
        contents: [
          {
            uri: uri,
            text: JSON.stringify(status, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  }); */
    //TODO: add prompts or remove the comment
    /*   server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return await registerPrompts();
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "help") {
      const helpSchema = z.object({
        topic: z.string().optional(),
      });
      const parsedArgs = helpSchema.safeParse(args);
      const topic = parsedArgs.success ? parsedArgs.data.topic : undefined;
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: topic
                ? `Please provide help and guidance about ${topic} in the context of Fireberry CRM.`
                : "Please provide an overview of how to use the Fireberry CRM MCP server and its capabilities.",
            },
          },
        ],
      };
    }

    throw new Error(`Unknown prompt: ${name}`);
  });
 */

    // Cleanup function for proper resource management
    const cleanup = () => {
        logger.info('Cleaning up server resources...');
        // Add any cleanup logic here (close database connections, etc.)
    };

    return { server, cleanup };
}
export type FireberryServer = ReturnType<typeof createServer>['server'];

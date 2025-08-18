import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { z } from 'zod';
import { registerTools } from './tools/index.js';
import { logger } from './utils/index.js';
import { VERSION } from './constants.js';

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

    server.setRequestHandler(CallToolRequestSchema, (request) => {
        const { name, arguments: args } = request.params;

        if (name === 'ping') {
            const pingSchema = z.object({
                message: z.string().optional(),
            });
            const parsedArgs = pingSchema.safeParse(args);
            const message = parsedArgs.success ? (parsedArgs.data.message ?? '') : '';
            return {
                content: [
                    {
                        type: 'text',
                        text: `Pong! ${message ? `Message: ${message}` : 'Server is running.'}`,
                    },
                ],
            };
        }

        throw new Error(`Unknown tool: ${name}`);
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

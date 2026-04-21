import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../utils/index.js';
import { ToolNames, type ToolName, type ToolsBundle, TOOLS_BUNDLES } from '../constants.js';
import { metadataPicklistToolInputSchema, metadataObjectsToolInputSchema, metadataFieldsToolInputSchema } from './metadata/index.js';
import { recordCreateToolInputSchema, recordUpdateToolInputSchema } from './record/index.js';
import { objectCreateToolInputSchema } from './object/index.js';
import { fieldCreateToolInputSchemaForRegister, fieldCreateToolInputSchemaForCall } from './field/index.js';
import { queryToolInputSchema } from './query/index.js';

export {
    metadataPicklistToolInputSchema,
    metadataObjectsToolInputSchema,
    metadataFieldsToolInputSchema,
    recordCreateToolInputSchema,
    recordUpdateToolInputSchema,
    objectCreateToolInputSchema,
    fieldCreateToolInputSchemaForRegister,
    fieldCreateToolInputSchemaForCall,
    queryToolInputSchema,
};

interface FireberryMCPTool extends Tool {
    name: (typeof ToolNames)[keyof typeof ToolNames];
}

const toolsEntries = [
    [
        ToolNames.metadataObjects,
        {
            name: ToolNames.metadataObjects,
            description: 'get all fireberry crm object types',
            inputSchema: zodToJsonSchema(metadataObjectsToolInputSchema),
        },
    ],
    [
        ToolNames.metadataFields,
        {
            name: ToolNames.metadataFields,
            description: 'get all fields by of a crm object',
            inputSchema: zodToJsonSchema(metadataFieldsToolInputSchema),
        },
    ],
    [
        ToolNames.metadataPicklist,
        {
            name: ToolNames.metadataPicklist,
            description: 'get all picklist options of a picklist type field',
            inputSchema: zodToJsonSchema(metadataPicklistToolInputSchema),
        },
    ],

    [
        ToolNames.recordCreate,
        {
            name: ToolNames.recordCreate,
            description: 'create a new crm record from a specified object type',
            inputSchema: zodToJsonSchema(recordCreateToolInputSchema),
        },
    ],
    [
        ToolNames.recordUpdate,
        {
            name: ToolNames.recordUpdate,
            description: 'update a crm record',
            inputSchema: zodToJsonSchema(recordUpdateToolInputSchema),
        },
    ],
    [
        ToolNames.objectCreate,
        {
            name: ToolNames.objectCreate,
            description: 'create a new crm object type',
            inputSchema: zodToJsonSchema(objectCreateToolInputSchema),
        },
    ],
    [
        ToolNames.fieldCreate,
        {
            name: ToolNames.fieldCreate,
            description: 'create a new text field in a crm object',
            inputSchema: zodToJsonSchema(fieldCreateToolInputSchemaForRegister),
        },
    ],
    [
        ToolNames.query,
        {
            name: ToolNames.query,
            description:
                'Query CRM records with filtering, sorting, and pagination. ' +
                'Field names support related-field traversal via underscore (e.g. `ownerid_fullname`). ' +
                'Without `groupBy` returns individual records; with `groupBy` returns aggregated results ' +
                '(`SUM`/`COUNT`/`MIN`/`MAX`) — non-aggregated and `orderBy` fields must appear in `groupBy`.',
            inputSchema: zodToJsonSchema(queryToolInputSchema),
        },
    ],
] as const satisfies [ToolName, FireberryMCPTool][];

const toolsMap = Object.fromEntries(toolsEntries) as { [key in ToolName]: FireberryMCPTool & { name: key } };

/**
 * Register all tools and return the tools list
 */
export function registerTools(toolsBundle: ToolsBundle = TOOLS_BUNDLES.all) {
    let tools: FireberryMCPTool[] = [];

    switch (toolsBundle) {
        case TOOLS_BUNDLES.all: {
            tools = Object.values(toolsMap);
            break;
        }
        case TOOLS_BUNDLES.systemAdmin:
            {
                tools = [
                    toolsMap[ToolNames.metadataObjects],
                    toolsMap[ToolNames.metadataFields],
                    toolsMap[ToolNames.metadataPicklist],
                    toolsMap[ToolNames.objectCreate],
                    toolsMap[ToolNames.fieldCreate],
                ] as const;
            }
            break;
        case TOOLS_BUNDLES.insights:
            {
                tools = [
                    toolsMap[ToolNames.metadataObjects],
                    toolsMap[ToolNames.metadataFields],
                    toolsMap[ToolNames.metadataPicklist],
                    toolsMap[ToolNames.recordCreate],
                    toolsMap[ToolNames.recordUpdate],
                    toolsMap[ToolNames.query],
                ] as const;
            }
            break;
        default:
            tools = Object.values(toolsMap);
    }
    return { tools } satisfies {
        tools: FireberryMCPTool[];
    };
}

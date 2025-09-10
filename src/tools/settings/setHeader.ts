import { z } from 'zod';
import { ToolNames } from '../../constants.js';

export const setMenuItemsToolInputSchema = z.object({
    items: z.array(
        z.object({
            index: z.int().min(0).describe('The position of the item in the header/menu'),
            objectType: z
                .int()
                .positive()
                .nullable()
                .describe('The object type that the item click will navigate to, null in case of a custom link, must match mdobjectid'), // can be number or null
            label: z
                .string()
                .describe('The display name of the item will display in the header/menu. will be the plural name of the object type'),

            customLink: z
                .string()
                .default('')
                .describe(
                    "Optional custom URL override. Use for special navigation (e.g., '/app/calendar', '/app/dashboard'). Leave empty for standard object navigation. When used, set objectType to null."
                ),
            mdobjectid: z
                .uuid()
                .describe(
                    `REQUIRED: The unique identifier that determines which object appears in the menu. Must be a valid mdobjectid (and matches objectType if present) from the system metadata (use the ${ToolNames.metadataObjects} tool to find valid IDs). Invalid IDs will cause the menu item to not appear.`
                )
                .describe(
                    'REQUIRED: A valid mdobjectid of object that the item click will navigate to. you can get this from the metadata objects tool. an invalid id will silently fail and the item will not be added to the header/menu'
                ),
            linkType: z
                .string()
                .default('1')
                .describe("The link type of the item (probably 1), don't use unless you copy the behavior from the current item"),
        })
    ),
});

export type SetMenuItemInput = z.infer<typeof setMenuItemsToolInputSchema>;

export const setMenuItemsResponseSchema = z.looseObject({
    status: z.boolean().describe('Whether the items were set successfully'),
});

export type SetMenuItemsResponse = z.infer<typeof setMenuItemsResponseSchema>;

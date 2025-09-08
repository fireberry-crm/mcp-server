import { z } from 'zod';

export const getMenuItemsToolInputSchema = z.object({});

export const getMenuItemsResponseSchema = z.looseObject({
    menuItems: z.array(
        z.looseObject({
            index: z.int().positive(),
            objectType: z.int().positive().nullable(), // can be number or null
            mdobjectid: z.uuid(), // UUID string
            linkType: z.string(), // e.g. "1"
            label: z.string(),
            viewId: z.uuid().or(z.literal('')), // can be "" or UUID
            customLink: z.string(), // "" or "/app/...”
        })
    ),
});

export type GetMenuItemsResponse = z.infer<typeof getMenuItemsResponseSchema>;

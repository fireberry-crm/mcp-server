import { z } from 'zod';

export const setMenuItemsToolInputSchema = z.object({
    items: z.array(
        z.object({
            index: z.int().positive().describe('The position of the item in the header/menu'),
            objectType: z
                .int()
                .positive()
                .nullable()
                .describe('The object type that the item click will navigate to, null in case of a custom link'), // can be number or null
            label: z
                .string()
                .describe('The display name of the item will display in the header/menu. will be the plural name of the object type'),
            customLink: z
                .string()
                .default('')
                .describe("An optional override for the item click behavior. don't use unless you copy the behavior from the current item"),
            mdobjectid: z.uuid().describe('The object id of the item'),
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

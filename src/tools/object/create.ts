import { z } from 'zod';

export const objectCreateSchema = z.object({
    name: z.string().min(1).max(80).describe('The name of the object e.g. Account'),
    collectionname: z.string().min(1).max(80).describe('The plural name of the object e.g. Accounts'),
});

export const CreateObjectSchema = z.discriminatedUnion('success', [
    z.object({
        success: z.literal(true),
        record: z.object({
            objecttypecode: z.number(),
        }),
        _id: z.uuid(),
    }),
    z.object({
        success: z.optional(z.literal(false)),
        Message: z.string(),
    }),
]);

export type CreateObject = z.infer<typeof CreateObjectSchema>;

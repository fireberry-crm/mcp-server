import { z } from 'zod';

export const recordCreateToolInputSchema = z.object({
    objectType: z.int().describe('The object type to create a record for'),
    fields: z.record(z.string(), z.unknown()).describe('The fields to create the record with'),
});

export const recordCreateResponseSchema = z.object({
    record: z.object({}),
    success: z.boolean(),
    _id: z.uuid(),
});

export type CreateRecord = z.infer<typeof recordCreateResponseSchema>;

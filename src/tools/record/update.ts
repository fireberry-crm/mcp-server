import { z } from 'zod';

export const recordUpdateToolInputSchema = z.object({
    objectType: z.int().describe('The object type to update a record for'),
    recordId: z.uuid().describe('The id of the record to update'),
    fields: z.record(z.string(), z.unknown()).describe('The fields to update the record with'),
});

export const recordUpdateResponseSchema = z.object({
    success: z.boolean(),
    record: z.record(z.string(), z.unknown()),
});

export type UpdateRecord = z.infer<typeof recordUpdateResponseSchema>;

import { z } from 'zod';

export const recordCreateSchema = z.object({
    objectType: z.string().describe('The object type to create a record for'),
    fields: z.record(z.string(), z.unknown()).describe('The fields to create the record with'),
});

export const CreateRecordSchema = z.object({
    record: z.object({}),
    success: z.boolean(),
    _id: z.uuid(),
});

export type CreateRecord = z.infer<typeof CreateRecordSchema>;

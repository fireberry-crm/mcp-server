import { z } from 'zod';

export const metadataObjectsSchema = z.object({});

export const MetadataObjectSchema = z.object({
    name: z.string(),
    systemName: z.string(),
    objectType: z.string().regex(/^\d+$/, { message: 'objectType must be a string containing only digits' }),
});

export type MetadataObject = z.infer<typeof MetadataObjectSchema>;

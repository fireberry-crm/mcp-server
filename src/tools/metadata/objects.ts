import { z } from 'zod';

export const metadataObjectsToolInputSchema = z.object({});

export const metadataObjectsResponseSchema = z.object({
    name: z.string(),
    systemName: z.string(),
    objectType: z.string().regex(/^\d+$/, { message: 'objectType must be a string containing only digits' }),
});

export type MetadataObject = z.infer<typeof metadataObjectsResponseSchema>;

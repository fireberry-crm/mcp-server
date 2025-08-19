import { z } from 'zod';

export const fieldCreateSchema = z.object({
    objectType: z.string().regex(/^\d+$/, 'Object type must be a numeric string').describe('The object type to add the field to'),
    fieldName: z.optional(
        z
            .string()
            .min(1)
            .max(100)
            .regex(/^pcf[a-zA-Z0-9]+$/, 'Field name must start with `pcf` and can only contain letters and numbers')
            .describe('The system name (sql column name) of the field, must start with `pcf` and can only contain letters and numbers')
    ),
    label: z.string().min(1).max(100).describe('The display label (readable ui name) for the field'),
});

export const CreateFieldSchema = z.discriminatedUnion('success', [
    z.object({
        success: z.literal(true),
        data: z.object({
            systemField: z.array(
                z.object({
                    fieldname: z.string(),
                })
            ),
        }),
        message: z.string(),
    }),
    z.object({
        success: z.optional(z.literal(false)),
        Message: z.string(),
    }),
]);

export type CreateField = z.infer<typeof CreateFieldSchema>;

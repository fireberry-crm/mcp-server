import { z } from 'zod';
import { FieldTypes, type FieldTypeName } from '../../constants.js';

export const metadataFieldsToolInputSchema = z.object({
    objectType: z.int().describe('The object type to get metadata for'),
});

const metadataFieldBaseSchema = z.object({
    label: z.string(),
    fieldName: z.string(),
    systemName: z.string(),
});

export const metadataFieldResponseSchema = metadataFieldBaseSchema.extend({
    systemFieldTypeId: z.enum(FieldTypes),
});

export interface MetadataField extends z.infer<typeof metadataFieldBaseSchema> {
    fieldType: FieldTypeName;
}

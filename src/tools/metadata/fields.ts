import { z } from 'zod';
import { FieldTypes, type FieldTypeName } from '../../constants';

export const metadataFieldsSchema = z.object({
    objectType: z.int().describe('The object type to get metadata for'),
});

export const MetadataFieldBaseSchema = z.object({
    label: z.string(),
    fieldName: z.string(),
    systemName: z.string(),
});

export const MetadataFieldFromAPI = MetadataFieldBaseSchema.extend({
    systemFieldTypeId: z.enum(FieldTypes),
});

export interface MetadataField extends z.infer<typeof MetadataFieldBaseSchema> {
    fieldType: FieldTypeName;
}

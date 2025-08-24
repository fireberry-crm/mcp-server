import { z } from 'zod';
import { FieldTypes, type FieldTypeName } from '../../constants.js';

export const metadataPicklistSchema = z.object({
    objectType: z.int().describe('The object type to get metadata for'),
    fieldName: z.string().describe('The picklist field name to get the values for'),
});

export const MetadataPicklistBaseSchema = z.object({
    label: z.string(),
    fieldName: z.string(),
    fieldObjectType: z.string().regex(/^\d+$/, { message: 'fieldObjectType must be a string containing only digits' }),
    systemName: z.string(),
    values: z.array(
        z.object({
            name: z.string(),
            value: z.string().regex(/^\d+$/, { message: 'value must be a string containing only digits' }),
        })
    ),
});

export const MetadataPicklistFromAPI = MetadataPicklistBaseSchema.extend({
    systemFieldTypeId: z.enum(FieldTypes),
});

export interface MetadataPicklist extends z.infer<typeof MetadataPicklistBaseSchema> {
    fieldType: FieldTypeName;
}

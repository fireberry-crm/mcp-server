import { z } from 'zod';
import { FieldTypes, type FieldTypeName } from '../../constants.js';

export const metadataPicklistToolInputSchema = z.object({
    objectType: z.int().describe('The object type to get metadata for'),
    fieldName: z.string().describe('The picklist field name to get the values for'),
});

const metadataPicklistBaseSchema = z.object({
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

export const metadataPicklistResponseSchema = metadataPicklistBaseSchema.extend({
    systemFieldTypeId: z.enum(FieldTypes),
});

export interface MetadataPicklist extends z.infer<typeof metadataPicklistBaseSchema> {
    fieldType: FieldTypeName;
}

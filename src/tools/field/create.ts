import { z } from 'zod';
import { FIELD_NAME_MAX_LENGTH_LIMIT, LABEL_MAX_LENGTH_LIMIT } from '../../constants';

export const FieldTypeNames = {
    text: 'text',
    emailAddress: 'emailaddress',
    url: 'url',
    phoneNumber: 'phonenumber',
    number: 'number',
    textarea: 'textarea',
    html: 'html',
    date: 'date',
    dateTime: 'datetime',
    lookup: 'lookup',
    summary: 'summary',
    formula: 'formula',
    picklist: 'picklist',
} as const;

export type FieldTypeNamesForCreate = (typeof FieldTypeNames)[keyof typeof FieldTypeNames];

// Base schema for common field parameters
const baseFieldSchema = z.object({
    objectType: z.int().describe('The object type to add the field to'),
    fieldName: z.optional(
        z
            .string()
            .min(1)
            .max(FIELD_NAME_MAX_LENGTH_LIMIT)
            .regex(/^pcf[a-zA-Z0-9]+$/, 'Field name must start with `pcf` and can only contain letters and numbers')
            .describe(
                'System field name (sql column name). Must start with `pcf` or the field will not be created. can only contain letters and numbers'
            )
    ),
    label: z.string().min(1).max(LABEL_MAX_LENGTH_LIMIT).describe('Field name used for system displays.'),
});

const dateFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.date).describe('The type of field to create'),
});
const dateTimeFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.dateTime).describe('The type of field to create'),
});
const phoneNumberFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.phoneNumber).describe('The type of field to create'),
});
const emailAddressFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.emailAddress).describe('The type of field to create'),
});
const urlFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.url).describe('The type of field to create'),
});
const textareaFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.textarea).describe('The type of field to create'),
});
const textFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.text).describe('The type of field to create'),
});

const numberFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.number).describe('The type of field to create'),
    precision: z.int().min(0).max(4).default(0).describe('Number between 0-4 to set the amount of digits after the decimal point'),
});

export const fieldCreateSchemaForCall = z.discriminatedUnion('fieldType', [
    textFieldSchema,
    numberFieldSchema,
    dateFieldSchema,
    dateTimeFieldSchema,
    phoneNumberFieldSchema,
    emailAddressFieldSchema,
    urlFieldSchema,
    textareaFieldSchema,
]);
export const fieldCreateSchemaForRegister = baseFieldSchema.extend({
    precision: z.optional(
        z
            .int()
            .min(0)
            .max(4)
            .default(0)
            .describe(
                '(required only for number fields, forbidden for others) Number between 0-4 to set the amount of digits after the decimal point'
            )
    ),
});

export type CreateFieldInputSchema<T extends FieldTypeNamesForCreate> = Extract<z.infer<typeof fieldCreateSchemaForCall>, { fieldType: T }>;
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

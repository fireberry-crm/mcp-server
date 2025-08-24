import { z } from 'zod';
import { FIELD_NAME_MAX_LENGTH_LIMIT, LABEL_MAX_LENGTH_LIMIT } from '../../constants.js';

export const FieldTypeNames = {
    text: 'text',
    emailAddress: 'emailaddress',
    url: 'url',
    phoneNumber: 'phonenumber',
    number: 'number',
    textarea: 'textarea',
    date: 'date',
    dateTime: 'datetime',
    lookup: 'lookup',
    picklist: 'picklist',
    // TODO: add these back when implemented
    // html: 'html',
    // summary: 'summary',
    // formula: 'formula',
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
const lookupFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.lookup).describe('The type of field to create'),
    relatedObjectType: z.int32().describe('The number of the object type this field will relate records from.'),
});

const picklistOptionSchema = z.object({
    order: z.int32().describe('Number from lowest (top) to highest (bottom) to set the order. Start at 1.'),
    color: z.string().describe('Set a hex color code, start with #. Defaults as black.'),
    label: z.string().describe('The name displayed for this option.'),
    value: z.int32().describe('The whole number used to identify this option, must be unique.'),
});

const picklistFieldSchema = baseFieldSchema.extend({
    fieldType: z.literal(FieldTypeNames.picklist).describe('The type of field to create'),
    options: z.array(picklistOptionSchema).nonempty().describe('The values of the picklist'),
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
    lookupFieldSchema,
    picklistFieldSchema,
]);
export const fieldCreateSchemaForRegister = baseFieldSchema.extend({
    fieldType: z.optional(z.string().describe(`REQUIRED The type of field to create ${Object.values(FieldTypeNames).join(',')}`)),
    precision: z.optional(
        z
            .int()
            .min(0)
            .max(4)
            .default(0)
            .describe(
                'optional only for `number` fields, forbidden for others) Number between 0-4 to set the amount of digits after the decimal point'
            )
    ),
    relatedObjectType: z.optional(
        z
            .int32()
            .describe(
                '(required only for `lookup` fields, forbidden for others) The number of the object type this field will relate records from.'
            )
    ),
    options: z.optional(
        z
            .array(picklistOptionSchema)
            .nonempty()
            .describe('(required only for `picklist` fields, forbidden for others) The values of the picklist')
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

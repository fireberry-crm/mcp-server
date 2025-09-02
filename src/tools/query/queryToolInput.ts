import { z } from 'zod';
import {
    OPERATIONS_WITHOUT_VALUE,
    OPERATIONS_WITH_ARRAY_ONLY,
    type QuerySchema,
    type SortDirection,
    type Condition,
    type ConditionGroup,
    type Filter,
    Operator,
    Type,
    type Value,
} from './constant.js';

// Validation helper functions
const validators = {
    // Validators for operators without value (isNull, isNotNull, etc.)
    noValueOperator: (condition: Condition, ctx: z.RefinementCtx) => {
        const { operator, value } = condition;
        if (value != undefined) {
            ctx.addIssue({
                code: 'custom',
                message: `Operator '${operator}' should not have a value`,
            });
        }
    },

    // Validators for array operators (in, notIn, etc.)
    arrayOperator: (condition: Condition, ctx: z.RefinementCtx) => {
        const { operator, value } = condition;

        if (!Array.isArray(value)) {
            ctx.addIssue({
                code: 'custom',
                message: `Operator '${operator}' requires an array value`,
            });
            return;
        }

        if (value.length === 0) {
            ctx.addIssue({
                code: 'custom',
                message: `Operator '${operator}' requires a non-empty array value`,
            });
        }
    },

    // Special validator for between operator
    betweenOperator: (condition: Condition, ctx: z.RefinementCtx) => {
        const { value } = condition;

        if (!value || !Array.isArray(value) || value.length !== 2) {
            ctx.addIssue({
                code: 'custom',
                message: `Operator 'between' requires exactly 2 values`,
            });
        }
    },

    // Validators for standard operators (eq, lt, gt, etc.)
    standardOperator: (condition: Condition, ctx: z.RefinementCtx) => {
        const { operator, value } = condition;

        if (Array.isArray(value)) {
            ctx.addIssue({
                code: 'custom',
                message: `Operator '${operator}' should not have an array value`,
            });
        }
    },

    // Validator that ensures value is present for operators that need it
    requiresValue: (condition: Condition, ctx: z.RefinementCtx) => {
        const { operator, value } = condition;

        if (value == undefined) {
            ctx.addIssue({
                code: 'custom',
                message: `Value is required for operator '${operator}'`,
            });
            return true;
        }
        return false;
    },
};

// Define value schema to match Value type from filter.ts
const singleValueSchema = z.union([z.string(), z.number(), z.boolean(), z.iso.date()]);

const conditionValueSchema = z.union([singleValueSchema, z.array(singleValueSchema)]).optional();

// Base condition schema with validation applied by operator type
const conditionSchema = z
    .object({
        fieldName: z.string().min(1, { message: 'Field name is required' }),
        operator: z.enum(Operator),
        value: conditionValueSchema,
    })
    .superRefine((condition, ctx) => {
        const { operator } = condition;

        // Apply correct validator based on operator type
        if (OPERATIONS_WITHOUT_VALUE.includes(operator)) {
            validators.noValueOperator(condition, ctx);
        } else {
            // All other operators require a value
            const stopValidation = validators.requiresValue(condition, ctx);
            if (stopValidation) return;

            if (operator === Operator.between) {
                validators.arrayOperator(condition, ctx);
                validators.betweenOperator(condition, ctx);
            } else if (OPERATIONS_WITH_ARRAY_ONLY.includes(operator)) {
                validators.arrayOperator(condition, ctx);
            } else {
                validators.standardOperator(condition, ctx);
            }
        }
    });

// Define the condition group schema
const conditionGroupSchema = z.object({
    type: z.enum(Type),
    conditions: z.array(conditionSchema).nonempty({
        message: 'At least one condition is required in a condition group',
    }),
});

// Define the filter schema as an array of condition groups
const filterSchema = z.array(conditionGroupSchema);

// Define sort order as an enum for better type safety
const SortOrder = z.enum(['asc', 'desc'] as const) satisfies z.ZodEnum<{ [k in SortDirection]: k }>;
type SortOrder = z.infer<typeof SortOrder>;

// Field schema with strongly typed order
const fieldWithOrderSchema = z.object({
    name: z.string().min(1, { message: 'Field name is required' }),
    order: SortOrder.optional(),
});

const fieldSchema = z.object({
    name: z.string().min(1, { message: 'Field name cannot be empty' }),
});

// Define the query schema with appropriate defaults and validations
export const queryZodSchema = z.object({
    objectType: z.number().int().positive('Object type must be a positive integer'),

    fields: z.array(fieldSchema).nonempty({ message: 'At least one field must be specified' }),

    pageSize: z.number().int().min(1).max(500).optional().default(25),

    filter: filterSchema.optional(),

    pageNumber: z.number().int().min(1, 'Page number must be a positive integer').optional().default(1),

    orderBy: z.array(fieldWithOrderSchema).optional(),
});

// Export type for the query data
export type QueryZodSchema = z.infer<typeof queryZodSchema>;

// Helper to validate if a zod schema matches our types
type Extends<A, B> = A extends B ? (B extends A ? true : false) : false;
type ValidateZodSchemaWithType<Z extends z.ZodType, T> = Extends<z.infer<Z>, T>;

// Will error if they don't match. in case of error use z.infer + hover to easily find the error
const _isValueSchemaCorrect: ValidateZodSchemaWithType<typeof singleValueSchema, Value> = true;
const _isConditionalValueSchemaCorrect: ValidateZodSchemaWithType<typeof conditionValueSchema, Condition['value']> = true;
const _isConditionSchemaCorrect: ValidateZodSchemaWithType<typeof conditionSchema, Condition> = true;
const _isConditionGroupSchemaCorrect: ValidateZodSchemaWithType<typeof conditionGroupSchema, ConditionGroup> = true;
const _isFilterSchemaCorrect: ValidateZodSchemaWithType<typeof filterSchema, Filter> = true;
const _isFieldWithOrderSchemaCorrect: ValidateZodSchemaWithType<typeof fieldWithOrderSchema, NonNullable<QuerySchema['orderBy']>[number]> =
    true;
const _isQuerySchemaCorrect: ValidateZodSchemaWithType<typeof queryZodSchema, QuerySchema> = true;

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
    AggrFunc,
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

// Soft enum of relative date tokens accepted by the API on date/datetime
// fields with `eq`/`ne`/`lt`/`gt`/`le`/`ge` operators. Listed here so the
// LLM sees them as known values, but `z.string()` below still allows any
// other string (ISO dates, IDs, etc.) — equivalent to TypeScript's
// `RelativeDateToken | (string & {})` pattern.
const RelativeDateToken = z.enum([
    'now',
    'today',
    'yesterday',
    'tomorrow',
    'this-week',
    'last-week',
    'next-week',
    'last-2-weeks',
    'next-2-weeks',
    'this-month',
    'last-month',
    'next-month',
    'this-year',
    'last-year',
    'next-year',
    'last-30-days',
    'next-30-days',
    'last-60-days',
    'next-60-days',
    'last-90-days',
    'next-90-days',
    'last-2-months',
    'next-2-months',
    'last-3-months',
    'next-3-months',
    'last-12-months',
    'next-12-months',
    'this-quarterly',
    'last-quarterly',
    'next-quarterly',
    'quarterly-1',
    'quarterly-2',
    'quarterly-3',
    'quarterly-4',
    '2-days-ago',
    '2-days-after',
]);

// Define value schema to match Value type from filter.ts
const singleValueSchema = z.union([RelativeDateToken, z.string(), z.number(), z.boolean()]);

const conditionValueSchema = z
    .union([singleValueSchema, z.array(singleValueSchema)])
    .optional()
    .describe(
        'Value to compare against. Omit for `is-null`/`is-not-null`/`userid`; ' +
            'array for `eq-in`/`not-in`/`between`; single value otherwise.'
    );

// Base condition schema with validation applied by operator type
const conditionSchema = z
    .object({
        fieldName: z
            .string()
            .min(1, { message: 'Field name is required' })
            .describe('A valid field name. Use an underscore to traverse a lookup, e.g. `ownerid_fullname`.'),
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

const relatedFieldNote = 'Use an underscore to traverse a lookup, e.g. `ownerid_fullname`.';

// Field schema with strongly typed order
const fieldWithOrderSchema = z.object({
    name: z.string().min(1, { message: 'Field name is required' }).describe(`Field name to sort by. ${relatedFieldNote}`),
    order: SortOrder.optional().describe('Sort direction. Defaults to `asc`.'),
});

const groupByFieldSchema = z.object({
    name: z.string().min(1, { message: 'Field name cannot be empty' }).describe(`Field name to group results by. ${relatedFieldNote}`),
});

const fieldSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Field name cannot be empty' })
        .describe(`Field name to include in the response. ${relatedFieldNote}`),
    alias: z
        .string()
        .min(1)
        .optional()
        .describe('Alias for the aggregated value in the response. Only meaningful when `aggrFunc` is set; ignored otherwise.'),
    aggrFunc: z.enum(AggrFunc).optional().describe('Aggregate function to apply. Requires the query to also specify `groupBy`.'),
});

// Define the query schema with appropriate defaults and validations
export const queryZodSchema = z
    .object({
        objectType: z.number().int().positive('Object type must be a positive integer'),

        fields: z.array(fieldSchema).nonempty({ message: 'At least one field must be specified' }),

        pageSize: z.number().int().min(1).max(500).optional().default(25),

        filter: filterSchema.optional(),

        pageNumber: z.number().int().min(1, 'Page number must be a positive integer').optional().default(1),

        orderBy: z.array(fieldWithOrderSchema).optional(),

        groupBy: z.array(groupByFieldSchema).nonempty({ message: 'At least one groupBy field is required' }).optional(),
    })
    .superRefine((query, ctx) => {
        const hasAggrFunc = query.fields.some((f) => f.aggrFunc);
        const hasGroupBy = !!query.groupBy;

        if (hasAggrFunc && !hasGroupBy) {
            ctx.addIssue({
                code: 'custom',
                message: 'groupBy is required when any field uses aggrFunc',
                path: ['groupBy'],
            });
        }

        if (query.groupBy && !hasAggrFunc) {
            const groupByNames = new Set(query.groupBy.map((g) => g.name));
            const nonGroupedWithoutAggr = query.fields.filter((f) => !groupByNames.has(f.name) && !f.aggrFunc);
            if (nonGroupedWithoutAggr.length > 0) {
                ctx.addIssue({
                    code: 'custom',
                    message: `Fields not in groupBy must have an aggrFunc: ${nonGroupedWithoutAggr.map((f) => f.name).join(', ')}`,
                    path: ['fields'],
                });
            }
        }
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
const _isFieldSchemaCorrect: ValidateZodSchemaWithType<typeof fieldSchema, QuerySchema['fields'][number]> = true;
const _isFieldWithOrderSchemaCorrect: ValidateZodSchemaWithType<typeof fieldWithOrderSchema, NonNullable<QuerySchema['orderBy']>[number]> =
    true;
const _isGroupBySchemaCorrect: ValidateZodSchemaWithType<typeof groupByFieldSchema, NonNullable<QuerySchema['groupBy']>[number]> = true;
const _isQuerySchemaCorrect: ValidateZodSchemaWithType<typeof queryZodSchema, QuerySchema> = true;

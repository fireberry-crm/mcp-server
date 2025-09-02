export type Filter = ConditionGroup[];

export type ConditionGroup = {
    type: Type;
    conditions: Condition[];
};

export const Type = {
    and: 'AND',
    or: 'OR',
} as const;

export type Type = (typeof Type)[keyof typeof Type];

export type Condition = {
    fieldName: string;
    operator: Operator;
    value?: Value | Value[];
};

export const Operator = {
    equal: 'eq',
    notEqual: 'ne',
    lowerThan: 'lt',
    greaterThan: 'gt',
    startWith: 'start-with',
    notStartWith: 'not-start-with',
    isNull: 'is-null',
    isNotNull: 'is-not-null',
    in: 'eq-in',
    notIn: 'not-in',
    between: 'between',
    currentUser: 'userid',
    lowerEqual: 'le',
    greaterEqual: 'ge',
} as const;

export type Operator = (typeof Operator)[keyof typeof Operator];

type ISODateString = ReturnType<Date['toISOString']> & Record<never, never>;

export type Value = string | ISODateString | number | boolean;

export type SortDirection = 'asc' | 'desc';

export type QuerySchema = {
    fields: { name: string }[];
    objectType: number;
    pageSize: number;
    orderBy?: { name: string; order?: SortDirection }[];
    pageNumber: number;
    filter?: Filter;
    groupBy?: { name: string }[];
};

export const OPERATIONS_WITHOUT_VALUE: Operator[] = [Operator.isNull, Operator.isNotNull, Operator.currentUser];

export const OPERATIONS_WITH_ARRAY_ONLY: Operator[] = [Operator.in, Operator.notIn, Operator.between];

export type QueryData = { data: Array<Record<string, string | Date | number> & Record<'_id', string>> } & { isLastPage: boolean };

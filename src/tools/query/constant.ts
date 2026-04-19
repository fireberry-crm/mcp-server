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

/**
 * Relative date tokens accepted by the API on date/datetime fields with
 * `eq`/`ne`/`lt`/`gt`/`le`/`ge` operators. Used as a documentation hint to
 * the LLM; arbitrary strings (e.g. ISO dates) are still accepted on the wire.
 */
export const RelativeDateToken = {
    now: 'now',
    today: 'today',
    yesterday: 'yesterday',
    tomorrow: 'tomorrow',
    thisWeek: 'this-week',
    lastWeek: 'last-week',
    nextWeek: 'next-week',
    last2Weeks: 'last-2-weeks',
    next2Weeks: 'next-2-weeks',
    thisMonth: 'this-month',
    lastMonth: 'last-month',
    nextMonth: 'next-month',
    thisYear: 'this-year',
    lastYear: 'last-year',
    nextYear: 'next-year',
    last30Days: 'last-30-days',
    next30Days: 'next-30-days',
    last60Days: 'last-60-days',
    next60Days: 'next-60-days',
    last90Days: 'last-90-days',
    next90Days: 'next-90-days',
    last2Months: 'last-2-months',
    next2Months: 'next-2-months',
    last3Months: 'last-3-months',
    next3Months: 'next-3-months',
    last12Months: 'last-12-months',
    next12Months: 'next-12-months',
    thisQuarterly: 'this-quarterly',
    lastQuarterly: 'last-quarterly',
    nextQuarterly: 'next-quarterly',
    quarterly1: 'quarterly-1',
    quarterly2: 'quarterly-2',
    quarterly3: 'quarterly-3',
    quarterly4: 'quarterly-4',
    twoDaysAgo: '2-days-ago',
    twoDaysAfter: '2-days-after',
} as const;

export type RelativeDateToken = (typeof RelativeDateToken)[keyof typeof RelativeDateToken];

export const AggrFunc = {
    sum: 'SUM',
    count: 'COUNT',
    min: 'MIN',
    max: 'MAX',
} as const;

export type AggrFunc = (typeof AggrFunc)[keyof typeof AggrFunc];

export type QuerySchema = {
    fields: { name: string; alias?: string; aggrFunc?: AggrFunc }[];
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

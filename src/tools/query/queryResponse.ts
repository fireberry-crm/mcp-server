import { z } from 'zod';

const queryDataItemBaseSchema = z.record(z.string(), z.union([z.string(), z.date(), z.number(), z.null()]));

const queryDataItemWithIdSchema = z.intersection(queryDataItemBaseSchema, z.object({ _id: z.uuid() }));

const queryResponseBaseSchema = z.looseObject({
    isLastPage: z.boolean(),
    pageNumber: z.number(),
    pageSize: z.number(),
    message: z.string(),
});

/**
 * Response shape for non-aggregation queries. Every row must include `_id`
 * (a record UUID); a missing or invalid `_id` indicates a real bug.
 */
export const recordQueryResponseSchema = queryResponseBaseSchema.extend({
    data: z.array(queryDataItemWithIdSchema),
});

/**
 * Response shape for aggregation queries (`groupBy` set on the request).
 * Aggregated rows do not correspond to individual records and have no `_id`.
 */
export const aggregatedQueryResponseSchema = queryResponseBaseSchema.extend({
    data: z.array(queryDataItemBaseSchema),
});

export type QueryResponse = z.infer<typeof recordQueryResponseSchema> | z.infer<typeof aggregatedQueryResponseSchema>;

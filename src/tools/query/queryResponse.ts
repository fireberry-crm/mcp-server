import { z } from 'zod';

const queryDataItemSchema = z.record(z.string(), z.union([z.string(), z.date(), z.number(), z.null()]));

export const queryResponseSchema = z.looseObject({
    data: z.array(queryDataItemSchema),
    isLastPage: z.boolean(),
    pageNumber: z.number(),
    pageSize: z.number(),
    message: z.string(),
});

export type QueryResponse = z.infer<typeof queryResponseSchema>;

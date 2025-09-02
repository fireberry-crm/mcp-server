import { z } from 'zod';

interface QueryDataItem {
    _id: string;
    [key: string]: string | Date | number;
}

export interface QueryData {
    data: QueryDataItem[];
    isLastPage: boolean;
}

export const queryResponseSchema = z.looseObject({
    data: z.array(z.intersection(z.record(z.string(), z.union([z.string(), z.date(), z.number(), z.null()])), z.object({ _id: z.uuid() }))),
    isLastPage: z.boolean(),
    pageNumber: z.number(),
    pageSize: z.number(),
    message: z.string(),
});

export type QueryResponse = z.infer<typeof queryResponseSchema>;

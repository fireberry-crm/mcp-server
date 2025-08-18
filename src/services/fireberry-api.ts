import { z } from 'zod';
import { logger } from '../utils';
import env from '../env';
import type { AutocompleteString } from '../types';
import { FieldTypes, ReverseFieldTypes, type FieldTypeName } from '../constants';

const headers = {
    'Content-Type': 'application/json',
    tokenid: env.TOKEN_ID,
};
const MetadataObjectSchema = z.object({
    name: z.string(),
    systemName: z.string(),
    objectType: z.string().regex(/^\d+$/, { message: 'objectType must be a string containing only digits' }),
});
const MetadataFieldBaseSchema = z.object({
    label: z.string(),
    fieldName: z.string(),
    systemName: z.string(),
});
const MetadataFieldFromAPI = MetadataFieldBaseSchema.extend({
    systemFieldTypeId: z.enum(FieldTypes),
});

const MetadataPicklistBaseSchema = z.object({
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
const MetadataPicklistFromAPI = MetadataPicklistBaseSchema.extend({
    systemFieldTypeId: z.enum(FieldTypes),
});
const CreateRecordSchema = z.object({
    record: z.object({}),
    success: z.boolean(),
    _id: z.uuid(),
});

const UpdateRecordResponseSchema = z.object({
    success: z.boolean(),
    record: z.record(z.string(), z.unknown()),
});

/***
 * status 400
 */
interface FireberryError {
    Message: AutocompleteString<
        | 'Invalid Record Name'
        | 'An internal error has occured while processing your request. Please check your data'
        | `Invalid field name: '${string}'`
        | 'An error has occurred.'
    >;
}
function isFireberryError(error: unknown): error is FireberryError {
    const errorSchema = z.object({ Message: z.string() });
    const parsedError = errorSchema.safeParse(error);
    return parsedError.success;
}

/**
 * Expressing a JSON with the return type of out application.
 */
interface FireberryResponse<T> {
    /** This will be the type of the object you want to return .*/
    data: T;
    /** Boolean that indicates whether the request success or not */
    success: z.ZodBoolean;
    /** Optional message for the client */
    message: z.ZodString;
}

/**
 * @returns {z.ZodObject<FireberryResponse<T>, z.core.$strip>}
 */
const getFireberryMetadataResponseSchema = <T extends z.ZodObject | z.ZodArray>(schema: T): z.ZodObject<Readonly<FireberryResponse<T>>> => {
    return z.object({
        data: schema,
        success: z.boolean(),
        message: z.string(),
    });
};
type MetadataObject = z.infer<typeof MetadataObjectSchema>;
interface MetadataField extends z.infer<typeof MetadataFieldBaseSchema> {
    fieldType: FieldTypeName;
}
interface MetadataPicklist extends z.infer<typeof MetadataPicklistBaseSchema> {
    fieldType: FieldTypeName;
}
type CreateRecord = z.infer<typeof CreateRecordSchema>;
type UpdateRecord = z.infer<typeof UpdateRecordResponseSchema>;

export const fireberryApi = {
    getMetadataObjects: async (): Promise<MetadataObject[] | { error: string }> => {
        // const endpointV2 = `${BASE_URL}/api/v2/metadata/objects`;
        const endpointV1 = `${env.BASE_URL}/metadata/records`;
        try {
            const response = await fetch(endpointV1, { headers });
            const data = await response.json();

            const parsedData = getFireberryMetadataResponseSchema(z.array(MetadataObjectSchema).nonempty()).parse(data);

            return parsedData.data;
        } catch (error) {
            if (isFireberryError(error)) {
                return { error: error.Message };
            } else {
                logger.error(error as string);
                return { error: 'Unknown error' };
            }
        }
    },
    getMetadataFields: async (objectType: string): Promise<MetadataField[] | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/metadata/records/${objectType}/fields`;

            const response = await fetch(endpoint, { headers });
            const data = await response.json();

            const parsedData = getFireberryMetadataResponseSchema(z.array(MetadataFieldFromAPI).nonempty()).parse(data);

            return parsedData.data.map(({ systemFieldTypeId, ...field }) => ({
                ...field,
                fieldType: ReverseFieldTypes[systemFieldTypeId],
            }));
        } catch (error) {
            if (isFireberryError(error)) {
                return { error: error.Message };
            } else {
                logger.error(error as string);
                return { error: 'Unknown error' };
            }
        }
    },
    getMetadataPicklist: async (objectType: string, fieldname: string): Promise<MetadataPicklist | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/metadata/records/${objectType}/fields/${fieldname}/values`;
            const response = await fetch(endpoint, { headers });
            const data = await response.json();
            const parsedData = getFireberryMetadataResponseSchema(MetadataPicklistFromAPI).safeParse(data);
            if (!parsedData.success) {
                logger.error(JSON.stringify(data, null, 2));
                if (isFireberryError(data)) return { error: data.Message };
                else {
                    logger.error(data as string);
                    return { error: 'Unknown error' };
                }
            }
            const { systemFieldTypeId, ...picklist } = parsedData.data.data;
            return {
                ...picklist,
                fieldType: ReverseFieldTypes[systemFieldTypeId],
            };
        } catch (error) {
            logger.error(error as string);
            return { error: 'Unknown error' };
        }
    },
    createRecord: async (objectType: string, fields: Record<string, unknown>): Promise<CreateRecord | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/api/v2/record/${objectType}`;
            const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(fields) });
            const data = await response.json();
            const parsedData = CreateRecordSchema.safeParse(data);
            if (!parsedData.success) {
                if (isFireberryError(data)) return { error: data.Message };
                else {
                    logger.error(data as string);
                    return { error: 'Unknown error' };
                }
            }
            return parsedData.data;
        } catch (error) {
            logger.error(error as string);
            return { error: 'Unknown error' };
        }
    },
    updateRecord: async (
        objectType: string,
        recordId: string,
        fields: Record<string, unknown>
    ): Promise<UpdateRecord | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/api/v2/record/${objectType}/${recordId}`;
            const response = await fetch(endpoint, { method: 'PUT', headers, body: JSON.stringify(fields) });
            const data = await response.json();
            const parsedData = UpdateRecordResponseSchema.safeParse(data);
            if (!parsedData.success) {
                if (isFireberryError(data)) return { error: data.Message };
                else {
                    logger.error(data as string);
                    return { error: 'Unknown error' };
                }
            }
            return parsedData.data;
        } catch (error) {
            logger.error(error as string);
            return { error: 'Unknown error' };
        }
    },
};

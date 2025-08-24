import { z } from 'zod';
import { logger } from '../utils';
import { env } from '../env';
import type { AutocompleteString } from '../types';
import { ReverseFieldTypes } from '../constants';
import {
    MetadataObjectSchema,
    type MetadataObject,
    MetadataFieldFromAPI,
    MetadataPicklistFromAPI,
    type MetadataField,
    type MetadataPicklist,
} from '../tools/metadata';
import { CreateRecordSchema, UpdateRecordResponseSchema, type CreateRecord, type UpdateRecord } from '../tools/record';
import { CreateObjectSchema, type CreateObject } from '../tools/object';
import { CreateFieldSchema, type CreateField } from '../tools/field';
import { FieldTypeNames, type CreateFieldInputSchema, type FieldTypeNamesForCreate } from '../tools/field/create';

const headers = {
    'Content-Type': 'application/json',
    tokenid: env.FIREBERRY_TOKEN_ID,
};

interface FireberryError {
    Message: AutocompleteString<
        | 'Invalid Record Name'
        | 'An internal error has occured while processing your request. Please check your data'
        | `Invalid field name: '${string}'`
        | 'The request is invalid.'
        | 'An error has occurred.'
        | 'Invalid Options' //picklist
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

export const fireberryApi = {
    getMetadataObjects: async (): Promise<MetadataObject[] | { error: string }> => {
        const endpointV1 = `${env.BASE_URL}/metadata/records`;
        try {
            const response = await fetch(endpointV1, { headers });
            const data = await response.json();

            const parsedData = getFireberryMetadataResponseSchema(z.array(MetadataObjectSchema).nonempty()).safeParse(data);
            if (!parsedData.success) {
                logger.error('Failed to parse metadata objects response:', parsedData.error);
                return { error: 'Invalid response format from API' };
            }

            return parsedData.data.data;
        } catch (error) {
            if (isFireberryError(error)) {
                return { error: error.Message };
            } else {
                logger.error(error as string);
                return { error: 'Unknown error' };
            }
        }
    },
    getMetadataFields: async (objectType: number): Promise<MetadataField[] | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/metadata/records/${String(objectType)}/fields`;

            const response = await fetch(endpoint, { headers });
            const data = await response.json();

            const parsedData = getFireberryMetadataResponseSchema(z.array(MetadataFieldFromAPI).nonempty()).safeParse(data);
            if (!parsedData.success) {
                logger.error('Failed to parse metadata fields response:', parsedData.error);
                return { error: 'Invalid response format from API' };
            }

            return parsedData.data.data.map(({ systemFieldTypeId, ...field }) => ({
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
    getMetadataPicklist: async (objectType: number, fieldname: string): Promise<MetadataPicklist | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/metadata/records/${String(objectType)}/fields/${fieldname}/values`;
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
    createRecord: async (objectType: number, fields: Record<string, unknown>): Promise<CreateRecord | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/api/v2/record/${String(objectType)}`;
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
        objectType: number,
        recordId: string,
        fields: Record<string, unknown>
    ): Promise<UpdateRecord | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/api/v2/record/${String(objectType)}/${recordId}`;
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
    createObject: async (name: string, collectionname: string): Promise<CreateObject | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/api/v2/record/58`;
            const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ name, collectionname }) });
            const data = await response.json();

            logger.debug(JSON.stringify(data, null, 2));
            if (isFireberryError(data)) {
                return { error: data.Message };
            }

            const parsedData = CreateObjectSchema.safeParse(data);
            if (!parsedData.success) {
                logger.error('Failed to parse create object response:', parsedData.error);
                return { error: 'Invalid response format from API' };
            }

            return parsedData.data;
        } catch (error) {
            logger.error(error as string);
            return { error: 'Unknown error' };
        }
    },

    createField: async (fieldData: CreateFieldInputSchema<FieldTypeNamesForCreate>): Promise<CreateField | { error: string }> => {
        try {
            const endpoint = `${env.BASE_URL}/api/v2/system-field/${String(fieldData.objectType)}/${fieldData.fieldType}`;
            const body = createFieldBody(fieldData);

            const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
            const data = await response.json();

            if (isFireberryError(data)) {
                return { error: data.Message };
            }

            const parsedData = CreateFieldSchema.safeParse(data);
            if (!parsedData.success) {
                logger.error('Failed to parse create field response:', parsedData.error);
                return { error: 'Invalid response format from API' };
            }

            return parsedData.data;
        } catch (error) {
            logger.error(error as string);
            return { error: 'Unknown error' };
        }
    },
};

function createFieldBody(fieldData: CreateFieldInputSchema<FieldTypeNamesForCreate>) {
    switch (fieldData.fieldType) {
        case FieldTypeNames.text:
        case FieldTypeNames.date:
        case FieldTypeNames.dateTime:
        case FieldTypeNames.phoneNumber:
        case FieldTypeNames.emailAddress:
        case FieldTypeNames.url:
        case FieldTypeNames.textarea:
            return { fieldName: fieldData.fieldName, label: fieldData.label };
        case FieldTypeNames.number:
            return { fieldName: fieldData.fieldName, label: fieldData.label, precision: fieldData.precision };
        case FieldTypeNames.lookup:
            return { fieldName: fieldData.fieldName, label: fieldData.label, relatedObjectType: fieldData.relatedObjectType };
        case FieldTypeNames.picklist:
            return { fieldName: fieldData.fieldName, label: fieldData.label, options: fieldData.options };
    }
}

import { z } from 'zod';

export const metadataObjectsToolInputSchema = z.object({});

export const metadataObjectsResponseSchema = z.looseObject({
    mdobjectid: z.uuid(),
    hasLicense: z.boolean(),
    objecttypecode: z.int().positive(),
    collectionname: z.string().or(z.null()),
    primarykeyname: z.string().or(z.null()),
    primaryviewid: z.uuid().or(z.null()),
    defaultviewid: z.uuid().or(z.null()),
    relatedviewid: z.uuid().or(z.null()),
    objectcustomtypecode: z.int(), //probably only 1 2 3
    isvalidformenu: z.int(), //probably only 0 1 2
    isvalidforsearch: z.int(), //probably only 0 1
    isreadonly: z.int(), //probably only 0 1
    name: z.string().or(z.null()),
    icon: z.string().or(z.null()),
    color: z.string().or(z.null()),
    primaryfieldname: z.string().or(z.null()),
    basetablename: z.string(),
    systemname: z.string(),
});

export type MetadataObject = z.infer<typeof metadataObjectsResponseSchema>;

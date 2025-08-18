export { version as VERSION, name as SERVER_NAME, description as SERVER_DESCRIPTION } from '../package.json';

export const ToolNames = {
    ping: 'ping',
    metadataObjects: 'metadata_objects',
    metadataFields: 'metadata_fields',
    metadataPicklist: 'metadata_picklist',
    recordCreate: 'record_create',
    recordUpdate: 'record_update',
} as const;
export type ToolName = (typeof ToolNames)[keyof typeof ToolNames];

export const FieldTypes = {
    date: '83bf530c-e04c-462b-9ffc-a46f750fc072',
    dateTime: 'ce972d02-5013-46d4-9d1d-f09df1ac346a',
    emailAddress: 'c713d2f7-8fa9-43c3-8062-f07486eaf567',
    lookup: 'a8fcdf65-91bc-46fd-82f6-1234758345a1',
    number: '6a34bfe3-fece-4da1-9136-a7b1e5ae3319',
    picklist: 'b4919f2e-2996-48e4-a03c-ba39fb64386c',
    richText: 'ed2ad39d-32fc-4585-8f5b-2e93463f050a',
    text: 'a1e7ed6f-5083-477b-b44c-9943a6181359',
    textArea: '80108f9d-1e75-40fa-9fa9-02be4ddc1da1',
    telephone: '3f62f67a-1cee-403a-bec6-aa02a9804edb',
    url: 'c820d32f-44df-4c2a-9c1e-18734e864fd5',
} as const;
export type FieldTypeName = keyof typeof FieldTypes;
export type FieldTypeId = (typeof FieldTypes)[FieldTypeName];

type Prettify<T> = {
    [K in keyof T]: T[K];
} & object;

type ReverseFieldTypeMap = Prettify<
    Readonly<{
        [K in FieldTypeName as (typeof FieldTypes)[K]]: K;
    }>
>;

export const ReverseFieldTypes: ReverseFieldTypeMap = Object.fromEntries(
    Object.entries(FieldTypes).map(([key, value]) => [value, key])
) as ReverseFieldTypeMap;

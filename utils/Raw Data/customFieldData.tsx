import { SelectOptionsType } from '../Types';

export const FieldTypesList: SelectOptionsType[] = [
    { label: 'Number', value: 'NUMBER' },
    { label: 'Dropdown', value: 'SELECT' },
    { label: 'Date', value: 'DATE' },
    { label: 'Text', value: 'TEXT' },
    { label: 'Checkbox', value: 'CHECKBOX' },
    { label: 'File Upload', value: 'FILE' },
    { label: 'Radio Button', value: 'RADIO' },
];

export const OperatorsList: SelectOptionsType[] = [
    { label: 'Equals', value: 'eq' },
    { label: 'Not Equals', value: 'neq' },
    { label: 'Less Than', value: 'lt' },
    { label: 'Less Than Equal To', value: 'lteq' },
    { label: 'Greater Than', value: 'gt' },
    { label: 'Grater Than Equal To', value: 'gteq' },
];

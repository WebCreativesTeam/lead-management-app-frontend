import { SelectOptionsType } from '../Types';

export const FieldTypesList: SelectOptionsType[] = [
    { label: 'Number', value: 'Number' },
    { label: 'Dropdown', value: 'Dropdown' },
    { label: 'Date', value: 'Date' },
    { label: 'Text', value: 'Text' },
    { label: 'Checkbox', value: 'Checkbox' },
    { label: 'File Upload', value: 'fileUpload' },
    { label: 'Radio Button', value: 'radioButton' },
];

export const OperatorsList: SelectOptionsType[] = [
    { label: 'Equals', value: 'Equals' },
    { label: 'Not Equals', value: 'NotEquals' },
    { label: 'Less Than', value: 'LessThan' },
    { label: 'Less Than Equal To', value: 'LessThanEqualTo' },
    { label: 'Greater Than', value: 'GreaterThan' },
    { label: 'Grater Than Equal To', value: 'GraterThanEqualTo' },
];

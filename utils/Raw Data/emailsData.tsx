import { SelectOptionsType } from "../Types";

export const SMTPList: SelectOptionsType[] = [
    { value: 'Gmail', label: 'Gmail' },
    { value: 'Yahoo', label: 'Yahoo' },
    { value: 'Outlook', label: 'Outlook' },
    { value: 'Hotmail', label: 'Hotmail' },
    { value: 'Others', label: 'Others' },
];


export const SMTPSecurityList: SelectOptionsType[] = [
    { value: 'none', label: 'none' },
    { value: 'SSL', label: 'SSL' },
    { value: 'TLS', label: 'TLS' },
    { value: 'STARTTLS', label: 'STARTTLS' },
];



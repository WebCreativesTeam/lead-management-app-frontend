import { ICampaign, SelectOptionsType, CampaignType } from '../Types';

export const campaignRawData: ICampaign[] = [
    {
        id: '1',
        campaignName: 'Schedule 1',
        leadStatus: 'New Lead',
        source: 'Website',
        product: 'Product A',
        template: 'Template  A',
        schedule: '2023-11-15',
        platform: ['Whatsapp', 'Email'],
        status: false,
        campaignType: 'OCCASIONAL',
    },
    {
        id: '2',
        campaignName: 'Schedule 2',
        leadStatus: 'Fresh',
        source: 'off campus',
        product: 'Product B',
        template: 'Template B',
        schedule: '2023-11-15',
        platform: ['SMS', 'Email'],
        status: true,
        campaignType: 'SCHEDULED',
    },
];

export const platformListRawData: SelectOptionsType[] = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
];

export const dummyTemplateListRawData: SelectOptionsType[] = [
    { value: 'template 1', label: 'template 1' },
    { value: 'template 2', label: 'template 2' },
    { value: 'template 3', label: 'template 3' },
];

export const campaignTypeList: SelectOptionsType[] = [
    {
        label: 'Schedule Campaign',
        value: 'SCHEDULED',
    },
    {
        label: 'Drip Campaign',
        value: 'DRIP',
    },
    {
        label: 'Occasional Campaign',
        value: 'OCCASIONAL',
    },
];

export const sendToDropdown: SelectOptionsType[] = [
    {
        label: 'Lead',
        value: 'LEAD',
    },
    {
        label: 'Contact',
        value: 'CONTACT',
    },
];

export const platformListDropdown: SelectOptionsType[] = [
    {
        label: 'Email',
        value: 'EMAIL',
    },
    {
        label: 'SMS',
        value: 'SMS',
    },
    {
        label: 'Whatsapp',
        value: 'WHATSAPP',
    },
];

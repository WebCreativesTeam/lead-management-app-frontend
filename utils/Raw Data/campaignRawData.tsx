import { ICampaign, CampaignType } from '../Types';

type SelectOptionsType = {
    value: string;
    label: string;
};

// export const campaignRawData: ICampaign[] = [
//     {
//         id: '1',
//         name: 'Schedule 1',
//         leadStatus: 'New Lead',
//         source: 'Website',
//         product: 'Product A',
//         template: 'Template  A',
//         schedule: '2023-11-15',
//         platform: ['Whatsapp', 'Email'],
//         status: false,
//         campaignType: 'OCCASIONAL',
//     },
//     {
//         id: '2',
//         campaignName: 'Schedule 2',
//         leadStatus: 'Fresh',
//         source: 'off campus',
//         product: 'Product B',
//         template: 'Template B',
//         schedule: '2023-11-15',
//         platform: ['SMS', 'Email'],
//         status: true,
//         campaignType: 'SCHEDULED',
//     },
// ];

export const platformListRawData: { value: string; label: string }[] = [
    { value: 'WhatsApp', label: 'WhatsApp' },
    { value: 'Email', label: 'Email' },
    { value: 'SMS', label: 'SMS' },
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

export const sendToDropdown: { value: string; label: string }[] = [
    {
        label: 'Lead',
        value: 'LEAD',
    },
    {
        label: 'Contact',
        value: 'CONTACT',
    },
];

export const contactDateDropdown: SelectOptionsType[] = [
    { label: 'Date Of Birth', value: 'DOB' },
    { label: 'Wedding Anniversary', value: 'anniversary' },
];

export const leadDateDropdown: SelectOptionsType[] = [...contactDateDropdown, { label: 'FollowUp Date', value: 'followUpDate' }, { label: 'Estimated Purchase Date', value: 'estimatedDate' }];

// export const platformListDropdown: SelectOptionsType[] = [
//     {
//         label: 'Email',
//         value: 'Email',
//     },
//     {
//         label: 'SMS',
//         value: 'SMS',
//     },
//     {
//         label: 'Whatsapp',
//         value: 'WhatsApp',
//     },
// ];

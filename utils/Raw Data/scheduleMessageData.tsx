import { IScheduleMessage } from '../Types';

export const scheduleMessagesRawData: IScheduleMessage[] = [
    {
        id: '1',
        scheduleName: 'Schedule 1',
        leadStatus: 'New Lead',
        source: 'Website',
        product: 'Product A',
        template: 'Template  A',
        schedule: '2023-11-15',
        platform: ['Whatsapp', 'Email'],
        status: false,
    },
    {
        id: '2',
        scheduleName: 'Schedule 2',
        leadStatus: 'Fresh',
        source: 'off campus',
        product: 'Product B',
        template: 'Template B',
        schedule: '2023-11-15',
        platform: ['SMS', 'Email'],
        status: true,
    },
];

import { IFollowup, SelectOptionsType } from '../Types';

export const followupData: IFollowup[] = [
    {
        name: 'John Doe',
        phoneNumber: '1234567890',
        source: {
            name: 'facebook',
            id: '1',
        },
        product: 'Product A',
        status: {
            color: 'green',
            id: '1',
            name: 'New Lead',
        },
        priority: {
            color: 'red',
            id: '1',
            name: 'Hot',
        },
        createdAt: '2023-11-01',
        updatedAt: '2023-11-01',
        nextFollowup: '2023-11-01',
        id: '1',
    },
];

export const followUpDropdownList: SelectOptionsType[] = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'pending', label: 'Pending' },
];

import React, { memo } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/taskSlice/manageTaskSlice';
import { IRootState } from '@/store';

const TaskViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.task);
    const dispatch = useDispatch();
    const { comment, createdAt, description, endDate, startDate, status, title, updatedAt, assignedBy, assignedTo, isActive, observer, priority, lead } = singleData;

    const reqData: any = {
        title,
        description,
        comment,
        Observer: `${observer?.firstName} ${observer?.lastName} (${observer?.email})`,
        ['Active Status']: isActive ? 'Active' : 'Not Active',
        Priority: (
            <>
                <span className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: priority?.color, backgroundColor: priority?.color + '20' }}>
                    {priority?.name}
                </span>
            </>
        ),
        ['assigned By']: `${assignedBy?.firstName} ${assignedBy?.lastName} (${assignedBy?.email})`,
        Lead: `${lead?.contact?.name} (${lead?.contact?.email})`,
        ['assigned To']: `${assignedTo?.firstName} ${assignedTo?.lastName} (${assignedTo?.email})`,
        ['Task Created']: new Date(createdAt).toLocaleString(),
        ['Task Updated']: new Date(updatedAt).toLocaleString(),
        ['Task Start Date']: new Date(startDate).toLocaleString(),
        ['Task End Date']: new Date(endDate).toLocaleString(),
        ['Task Status']: (
            <>
                <span className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: status?.color, backgroundColor: status?.color + '20' }}>
                    {status?.name}
                </span>
            </>
        ),
    };

    return (
        <ViewModal
            title="View Task Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        {Object.keys(reqData).map((item: string, i: number) => {
                            return (
                                <li className="flex flex-wrap" key={i}>
                                    <span className="flex-1 text-lg font-bold capitalize">{item}</span>
                                    <p className="flex-[2]"> {reqData[item]}</p>
                                </li>
                            );
                        })}
                    </ul>
                </>
            }
        />
    );
};

export default memo(TaskViewModal);

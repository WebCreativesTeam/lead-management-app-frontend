import React, { memo } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/taskSlice/manageTaskSlice';
import { IRootState } from '@/store';

const TaskViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.task);
    const dispatch = useDispatch();
    const { comment, createdAt, description, endDate, startDate, status, title, updatedAt, assignedBy, assignedTo, isActive, observer, priority } = singleData;

    const reqData: any = {
        title,
        description,
        comment,
        Observer: `${observer?.firstName} ${observer?.lastName}`,
        ['Active Status']: isActive ? 'Active' : 'Not Active',
        Priority: priority?.name,
        ['assigned By']: `${assignedBy?.firstName} ${assignedBy?.lastName}`,
        ['assigned To']: `${assignedTo?.firstName} ${assignedTo?.lastName}`,
        ['Task Created']: new Date(createdAt).toLocaleString(),
        ['Task Updated']: new Date(updatedAt).toLocaleString(),
        ['Task Start Date']: new Date(startDate).toLocaleString(),
        ['Task End Date']: new Date(endDate).toLocaleString(),
        ['Task Status']: status?.name,
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

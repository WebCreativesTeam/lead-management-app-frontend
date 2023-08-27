import React, { memo } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/taskSlice/taskStatusSlice';
import { IRootState } from '@/store';

const TaskStatusViewModal = () => {
    const {viewModal,singleData} = useSelector((state: IRootState) => state.taskStatus)
    const dispatch = useDispatch();

    return (
        <ViewModal
            title="View Task Status Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Staus Name</span>
                            <p className="flex-[2]">{singleData.name}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Status Created</span>
                            <p className="flex-[2]">{new Date(singleData.createdAt).toLocaleString()}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Last Updated</span>
                            <p className="flex-[2]">{new Date(singleData.updatedAt).toLocaleString()}</p>
                        </li>
                    </ul>
                </>
            }
        />
    );
};

export default memo(TaskStatusViewModal);

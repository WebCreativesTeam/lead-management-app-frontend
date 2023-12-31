import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/taskSlice/taskPrioritySlice';
import { TaskPriorityType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const TaskPriorityDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.taskPriority);
    const dispatch = useDispatch();
    const onDeleteTaskPriority = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteTaskPriority: TaskPriorityType = await new ApiClient().delete('task-priority/' + singleData.id);
        if (deleteTaskPriority === null) {
            dispatch(setDisableBtn(false));
            return;
        }

        dispatch(setDisableBtn(false));
        dispatch(setFetching(false));
        dispatch(setDeleteModal({ open: false }));
    };
    return (
        <ConfirmationModal
            open={deleteModal}
            onClose={() => dispatch(setDeleteModal({ open: false }))}
            onDiscard={() => dispatch(setDeleteModal({ open: false }))}
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Task Priority? It will also remove form database.</>}
            title="Delete Task Priority"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteTaskPriority}
            btnSubmitText="Delete"
        />
    );
};

export default memo(TaskPriorityDeleteModal);

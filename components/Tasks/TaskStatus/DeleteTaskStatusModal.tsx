import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/taskSlice/taskStatusSlice';
import { TaskStatusType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const TaskStatusDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.taskStatus);
    const dispatch = useDispatch();
    const onDeleteTaskStatus = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteTaskStatus: TaskStatusType = await new ApiClient().delete('task-status/' + singleData.id);
        if (Object.keys(deleteTaskStatus).length === 0) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setDeleteModal({ open: false }));
        dispatch(setFetching(false));
    };
    return (
        <ConfirmationModal
            open={deleteModal}
            onClose={() => dispatch(setDeleteModal({ open: false }))}
            onDiscard={() => dispatch(setDeleteModal({ open: false }))}
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Task Status? It will also remove form database.</>}
            title="Delete Task Status"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteTaskStatus}
            btnSubmitText="Delete"
        />
    );
};

export default memo(TaskStatusDeleteModal);

import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/taskSlice/manageTaskSlice';
import { TaskDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const TaskDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.task);
    const dispatch = useDispatch();
    const onDeleteTask = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteTask: TaskDataType = await new ApiClient().delete('task/' + singleData.id);
        dispatch(setDisableBtn(false));
        dispatch(setFetching(false));
        if (deleteTask === null) {
            return;
        }

        dispatch(setDeleteModal({ open: false }));
    };
    return (
        <ConfirmationModal
            open={deleteModal}
            onClose={() => dispatch(setDeleteModal({ open: false }))}
            onDiscard={() => dispatch(setDeleteModal({ open: false }))}
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Task? It will also remove form database.</>}
            title="Delete Task"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteTask}
            btnSubmitText="Delete"
        />
    );
};

export default memo(TaskDeleteModal);

import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDefaultStatusModal, setDisableBtn, setFetching } from '@/store/Slices/taskSlice/taskStatusSlice';
import { TaskPriorityType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const ChangeDefaultStatusModal = () => {
    const { isFetching, singleData, isBtnDisabled, defaultStatusModal } = useSelector((state: IRootState) => state.taskStatus);

    const dispatch = useDispatch();
    const onSubmitDefaultStatus = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const defaultStatus: TaskPriorityType = await new ApiClient().get(`task-status/${singleData.id}/set-default`);

        if (Object.keys(defaultStatus).length === 0) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setDefaultStatusModal({ open: false }));
        dispatch(setFetching(false));
    };
    return (
        <ConfirmationModal
            open={defaultStatusModal}
            onClose={() => dispatch(setDefaultStatusModal({ open: false }))}
            onDiscard={() => dispatch(setDefaultStatusModal({ open: false }))}
            description={isFetching ? <Loader /> : 'Are you sure you want to change default status? after submit all new create task have this selected default status option.'}
            title="Change Default Status"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onSubmitDefaultStatus}
        />
    );
};

export default memo(ChangeDefaultStatusModal);

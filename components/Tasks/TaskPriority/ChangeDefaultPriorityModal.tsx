import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDefaultPriorityModal, setDisableBtn, setFetching } from '@/store/Slices/taskSlice/taskPrioritySlice';
import { TaskPriorityType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const ChangeDefaultPriorityModal = () => {
    const { isFetching, singleData, isBtnDisabled, defaultPriorityModal } = useSelector((state: IRootState) => state.taskPriority);

    const dispatch = useDispatch();
    const onSubmitDefaultPriority = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const defaultPriority: TaskPriorityType = await new ApiClient().get(`task-priorities/${singleData.id}/set-default`);

        if (Object.keys(defaultPriority).length === 0) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setDefaultPriorityModal({ open: false }));
        dispatch(setFetching(false));
    };
    return (
        <ConfirmationModal
            open={defaultPriorityModal}
            onClose={() => dispatch(setDefaultPriorityModal({ open: false }))}
            onDiscard={() => dispatch(setDefaultPriorityModal({ open: false }))}
            description={isFetching ? <Loader /> : 'Are you sure you want to change default priority? after submit all new create task have this selected default priority options.'}
            title="Change Default Priority"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onSubmitDefaultPriority}
        />
    );
};

export default memo(ChangeDefaultPriorityModal);

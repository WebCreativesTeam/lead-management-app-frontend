import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadPrioritySlice';
import { LeadPriorityType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const LeadPriorityDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.leadPriority);
    const dispatch = useDispatch();
    const onDeleteLeadPriority = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteLeadPriority: LeadPriorityType = await new ApiClient().delete('lead-priority/' + singleData.id);
        if (deleteLeadPriority === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Lead Priority? It will also remove form database.</>}
            title="Delete Lead Priority"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteLeadPriority}
            btnSubmitText="Delete"
        />
    );
};

export default memo(LeadPriorityDeleteModal);

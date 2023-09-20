import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadStatusSlice';
import { LeadStatusType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const LeadStatusDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.leadStatus);
    const dispatch = useDispatch();
    const onDeleteLeadStatus = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteLeadStatus: LeadStatusType = await new ApiClient().delete('lead-status/' + singleData.id);
        if (deleteLeadStatus === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Lead Status? It will also remove form database.</>}
            title="Delete Lead Status"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteLeadStatus}
            btnSubmitText="Delete"
        />
    );
};

export default memo(LeadStatusDeleteModal);

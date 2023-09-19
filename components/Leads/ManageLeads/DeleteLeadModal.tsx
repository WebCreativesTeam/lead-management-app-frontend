import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/manageLeadSlice';
import { LeadDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const LeadDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.lead);
    const dispatch = useDispatch();
    const onDeleteLead = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteLead: LeadDataType = await new ApiClient().delete('lead/' + singleData.id);
        dispatch(setDisableBtn(false));
        dispatch(setFetching(false));
        if (deleteLead === null) {
            return;
        }

        dispatch(setDeleteModal({ open: false }));
    };
    return (
        <ConfirmationModal
            open={deleteModal}
            onClose={() => dispatch(setDeleteModal({ open: false }))}
            onDiscard={() => dispatch(setDeleteModal({ open: false }))}
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Lead? It will also remove form database.</>}
            title="Delete Lead"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteLead}
            btnSubmitText="Delete"
        />
    );
};

export default memo(LeadDeleteModal);

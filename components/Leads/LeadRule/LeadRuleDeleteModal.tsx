import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadRuleSlice';
import { ILeadRules } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const LeadRuleDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.leadRule);
    const dispatch = useDispatch();
    const onDeleteLeadRule = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteLeadRule: ILeadRules = await new ApiClient().delete('lead-rule/' + singleData.id);
        if (deleteLeadRule === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this rule? It will also remove form database.</>}
            title="Delete Lead Rule"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteLeadRule}
            btnSubmitText="Delete"
        />
    );
};

export default memo(LeadRuleDeleteModal);

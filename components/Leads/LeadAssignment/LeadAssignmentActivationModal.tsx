import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ICustomField } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';
import { setLeadAssignmentActivationModal, setFetching, setDisableBtn } from '@/store/Slices/leadSlice/leadAssigningSlice';

const LeadAssignmentActivationModal = () => {
    const { isFetching, singleData, leadAssignmentActivationModal } = useSelector((state: IRootState) => state.leadAssignment);

    const dispatch = useDispatch();
    const onSubmitDefaultCustomField = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const defaultCustomField: ICustomField = await new ApiClient().get(`lead-assignment/${singleData.id}/toggle-active`);

        if (Object.keys(defaultCustomField).length === 0) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setLeadAssignmentActivationModal({ open: false }));
        dispatch(setFetching(false));
    };
    return (
        <ConfirmationModal
            open={leadAssignmentActivationModal}
            onClose={() => dispatch(setLeadAssignmentActivationModal({ open: false }))}
            onDiscard={() => dispatch(setLeadAssignmentActivationModal({ open: false }))}
            description={isFetching ? <Loader /> : 'Are you sure you want to change  activation of Lead Assignment?.'}
            title="Change Custom Field Activation"
            isBtnDisabled={isFetching}
            onSubmit={onSubmitDefaultCustomField}
        />
    );
};

export default memo(LeadAssignmentActivationModal);

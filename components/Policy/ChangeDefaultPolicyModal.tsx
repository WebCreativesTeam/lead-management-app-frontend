import React, { memo } from 'react';
import ConfirmationModal from '../__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDefaultPolicyModal, setDisableBtn, setFetching } from '@/store/Slices/policySlice';
import { PolicyDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '../__Shared/Loader';

const ChangeDefaultPolicyModal = () => {
    const { isFetching, singleData, isBtnDisabled,defaultPolicyModal } = useSelector((state: IRootState) => state.policy);

    const dispatch = useDispatch();
    const onSubmitDefaultPolicy = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const defaultPolicy: PolicyDataType = await new ApiClient().get(`policies/${singleData.id}/set-default`);

        if (Object.keys(defaultPolicy).length === 0) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setDefaultPolicyModal({ open: false }));
        dispatch(setFetching(false));
    };
    return (
        <ConfirmationModal
            open={defaultPolicyModal}
            onClose={() => dispatch(setDefaultPolicyModal({ open: false }))}
            onDiscard={() => dispatch(setDefaultPolicyModal({ open: false }))}
            description={isFetching ? <Loader /> : 'Are you sure you want to change default policy? after submit all new create policy have this selected default policy options.'}
            title="Change Default Policy"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onSubmitDefaultPolicy}
        />
    );
};

export default memo(ChangeDefaultPolicyModal);

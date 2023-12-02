import React, { memo } from 'react';
import ConfirmationModal from '../__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setFieldActivationModal, setDisableBtn, setFetching } from '@/store/Slices/customFieldSlice';
import { ICustomField } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '../__Shared/Loader';

const ChangeDefaultCustomFieldModal = () => {
    const { isFetching, singleData, fieldActivationModal } = useSelector((state: IRootState) => state.customField);

    const dispatch = useDispatch();
    const onSubmitDefaultCustomField = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const defaultCustomField: ICustomField = await new ApiClient().get(`custom-field/${singleData.id}/toggle-active`);

        if (Object.keys(defaultCustomField).length === 0) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setFieldActivationModal({ open: false }));
        dispatch(setFetching(false));
    };
    return (
        <ConfirmationModal
            open={fieldActivationModal}
            onClose={() => dispatch(setFieldActivationModal({ open: false }))}
            onDiscard={() => dispatch(setFieldActivationModal({ open: false }))}
            description={isFetching ? <Loader /> : 'Are you sure you want to change  activation of custom Field?.'}
            title="Change Custom Field Activation"
            isBtnDisabled={isFetching}
            onSubmit={onSubmitDefaultCustomField}
        />
    );
};

export default memo(ChangeDefaultCustomFieldModal);

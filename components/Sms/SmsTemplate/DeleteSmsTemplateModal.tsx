import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/smsTemplateSlice';
import { ISmsTemplate } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const SmsTemplateDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.smsTemplate);
    const dispatch = useDispatch();
    const onDeleteSmsTemplate = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteSmsTemplate: ISmsTemplate = await new ApiClient().delete('sms-template/' + singleData.id);
        if (deleteSmsTemplate === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Sms Template? It will also remove form database.</>}
            title="Delete Sms Template"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteSmsTemplate}
            btnSubmitText="Delete"
        />
    );
};

export default memo(SmsTemplateDeleteModal);

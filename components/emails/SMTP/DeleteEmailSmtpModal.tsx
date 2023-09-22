import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/emailSlice/emailSmtpSlice';
import { IEmailSmtp } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const EmailSmtpDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.emailSmtp);
    const dispatch = useDispatch();
    const onDeleteEmailSmtp = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteEmailSmtp: IEmailSmtp = await new ApiClient().delete('smtp/' + singleData.id);
        if (deleteEmailSmtp === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this SMTP? It will also remove form database.</>}
            title="Delete SMTP"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteEmailSmtp}
            btnSubmitText="Delete"
        />
    );
};

export default memo(EmailSmtpDeleteModal);

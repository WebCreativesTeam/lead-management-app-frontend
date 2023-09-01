import React, { memo } from 'react';
import ConfirmationModal from '../__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/emailSlice';
import { IEmails } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '../__Shared/Loader';

const EmailDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.emails);
    const dispatch = useDispatch();
    const onDeleteEmailTemplate = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteTemplate: IEmails = await new ApiClient().delete('email-templates/' + singleData.id);
        if (Object.keys(deleteTemplate).length === 0) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Email Template? It will also remove form database.</>}
            title="Delete Email Template"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteEmailTemplate}
            btnSubmitText="Delete"
        />
    );
};

export default memo(EmailDeleteModal);

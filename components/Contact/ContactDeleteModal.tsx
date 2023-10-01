import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/contactSlice';
import { ContactDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const ContactDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.contacts);
    const dispatch = useDispatch();
    const onDeleteContact = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteContact: ContactDataType = await new ApiClient().delete('contact/' + singleData.id);
        if (deleteContact === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Contact? It will also remove form database.</>}
            title="Delete Contact"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteContact}
            btnSubmitText="Delete"
        />
    );
};

export default memo(ContactDeleteModal);

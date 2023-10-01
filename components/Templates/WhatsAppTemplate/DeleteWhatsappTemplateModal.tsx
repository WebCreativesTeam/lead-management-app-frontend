import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/templateSlice/whatsappTemplateSlice';
import { IWhatsappTemplate } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const WhatsappTemplateDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.whatsappTemplate);
    const dispatch = useDispatch();
    const onDeleteWhatsappTemplate = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteWhatsappTemplate: IWhatsappTemplate = await new ApiClient().delete('whatsapp-template/' + singleData.id);
        if (deleteWhatsappTemplate === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this whatsapp Template? It will also remove form database.</>}
            title="Delete whatsapp Template"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteWhatsappTemplate}
            btnSubmitText="Delete"
        />
    );
};

export default memo(WhatsappTemplateDeleteModal);

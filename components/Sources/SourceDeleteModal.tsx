import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/sourceSlice';
import { SourceDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const SourceDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.source);
    const dispatch = useDispatch();
    const onDeleteSource = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteSource: SourceDataType = await new ApiClient().delete('source/' + singleData.id);
        if (deleteSource === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Source? It will also remove form database.</>}
            title="Delete Source"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteSource}
            btnSubmitText="Delete"
        />
    );
};

export default memo(SourceDeleteModal);

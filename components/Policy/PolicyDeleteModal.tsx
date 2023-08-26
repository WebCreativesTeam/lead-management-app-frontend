import React, { memo } from 'react';
import ConfirmationModal from '../__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/policySlice';
import { PolicyDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '../__Shared/Loader';

const PolicyDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.policy);
    const dispatch = useDispatch();
    const onDeletePolicy = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deletePolicy: PolicyDataType = await new ApiClient().delete('policies/' + singleData.id);
        if (Object.keys(deletePolicy).length === 0) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Policy? It will also remove form database.</>}
            title="Delete Policy"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeletePolicy}
            btnSubmitText="Delete"
        />
    );
};

export default memo(PolicyDeleteModal);

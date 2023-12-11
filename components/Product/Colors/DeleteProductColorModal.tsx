import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/productColorSlice';
import { IProductColor } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const ProductColorDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.productColor);
    const dispatch = useDispatch();
    const onDeleteProductColor = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteProductColor: IProductColor = await new ApiClient().delete('color/' + singleData.id);
        if (deleteProductColor === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete this Color? It will also remove form database.</>}
            title="Delete Color"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteProductColor}
            btnSubmitText="Delete"
        />
    );
};

export default memo(ProductColorDeleteModal);

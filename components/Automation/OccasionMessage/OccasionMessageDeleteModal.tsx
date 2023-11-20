import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/automationSlice/occasionMessageSlice';
import { IOccasionMessage } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const OccasionMessageDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.occasionMessage);
    const dispatch = useDispatch();
    const onDeleteOccasionMessage = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteOccasionMessage: IOccasionMessage = await new ApiClient().delete('occasionMessage/' + singleData.id);
        if (deleteOccasionMessage === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete Occasiond Message?</>}
            title="Delete Occasion Message"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteOccasionMessage}
            btnSubmitText="Delete"
        />
    );
};

export default memo(OccasionMessageDeleteModal);

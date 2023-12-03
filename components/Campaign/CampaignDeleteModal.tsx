import React, { memo } from 'react';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setDeleteModal, setDisableBtn, setFetching } from '@/store/Slices/campaignSlice';
import { ICampaign } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '@/components/__Shared/Loader';

const CampaignDeleteModal = () => {
    const { isFetching, isBtnDisabled, deleteModal, singleData } = useSelector((state: IRootState) => state.campaign);
    const dispatch = useDispatch();
    const onDeleteCampaign = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteCampaign: ICampaign = await new ApiClient().delete('campaign/' + singleData.id);
        if (deleteCampaign === null) {
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
            description={isFetching ? <Loader /> : <>Are you sure you want to delete Campaign?</>}
            title="Delete Campaign"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onDeleteCampaign}
            btnSubmitText="Delete"
        />
    );
};

export default memo(CampaignDeleteModal);

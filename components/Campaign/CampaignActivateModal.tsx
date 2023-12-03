import React, { memo } from 'react';
import ConfirmationModal from '../__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setCampaigndActivationModal, setDisableBtn, setFetching } from '@/store/Slices/campaignSlice';
import { ICampaign } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import Loader from '../__Shared/Loader';

const ChangeActivationOfCampaignModal = () => {
    const { isFetching, singleData, campaignActivationModal } = useSelector((state: IRootState) => state.campaign);

    const dispatch = useDispatch();
    const onSubmitDefaultCampaign = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const defaultCampaign: ICampaign = await new ApiClient().get(`campaign/${singleData.id}/toggle-active`);

        if (Object.keys(defaultCampaign).length === 0) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setCampaigndActivationModal({ open: false }));
        dispatch(setFetching(false));
    };
    return (
        <ConfirmationModal
            open={campaignActivationModal}
            onClose={() => dispatch(setCampaigndActivationModal({ open: false }))}
            onDiscard={() => dispatch(setCampaigndActivationModal({ open: false }))}
            description={isFetching ? <Loader /> : 'Are you sure you want to change  activation of Campaign?.'}
            title="Change Campign Activation"
            isBtnDisabled={isFetching}
            onSubmit={onSubmitDefaultCampaign}
        />
    );
};

export default memo(ChangeActivationOfCampaignModal);

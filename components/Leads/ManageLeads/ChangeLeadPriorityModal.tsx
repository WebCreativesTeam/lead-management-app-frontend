import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import Loader from '@/components/__Shared/Loader';
import { IRootState } from '@/store';
import { setChangePriorityModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/manageLeadSlice';
import { showToastAlert } from '@/utils/contant';
import { ApiClient } from '@/utils/http';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ChangeLeadPriorityModal = () => {
    const dispatch = useDispatch();
    const { changePriorityModal, isBtnDisabled, singleData, singlePriority, isFetching } = useSelector((state: IRootState) => state.lead);

    const onChangePriotity = async () => {
        dispatch(setDisableBtn(true));
        dispatch(setFetching(true));
        try {
            await new ApiClient().patch(`lead/${singleData.id}/priority`, { priorityId: singlePriority.id });
            dispatch(setChangePriorityModal({ open: false }));
        } catch (error: any) {
            if (typeof error?.response?.data?.message === 'object') {
                showToastAlert(error?.response?.data?.message.join(' , '));
            } else {
                showToastAlert(error?.response?.data?.message);
            }
            showToastAlert(error?.response?.data?.message);
        }
        dispatch(setFetching(false));
        dispatch(setDisableBtn(false));
    };
    return (
        <ConfirmationModal
            open={changePriorityModal}
            onClose={() => dispatch(setChangePriorityModal({ open: false }))}
            onDiscard={() => dispatch(setChangePriorityModal({ open: false }))}
            description={
                isFetching ? (
                    <Loader />
                ) : (
                    <>
                        Are you sure you want to change this Lead priority? <br /> It will not revert!
                    </>
                )
            }
            title="Change lead priority"
            isBtnDisabled={isBtnDisabled}
            onSubmit={onChangePriotity}
            btnSubmitText="Change Priority"
        />
    );
};

export default ChangeLeadPriorityModal;


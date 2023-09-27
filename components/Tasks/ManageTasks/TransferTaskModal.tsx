import React, { memo } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setDisableBtn, setFetching, setTransferTaskModal } from '@/store/Slices/taskSlice/manageTaskSlice';
import { useFormik } from 'formik';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import Select from 'react-select';
import 'flatpickr/dist/flatpickr.css';
import { SelectOptionsType, UserListSecondaryEndpointType } from '@/utils/Types';

const TranserTaskModal = () => {
    const dispatch = useDispatch();
    const { isFetching, isBtnDisabled, usersList, transferTaskModal, singleData } = useSelector((state: IRootState) => state.task);

    const initialValues = {
        assignedTo: {
            value: '',
            label: '',
        },
        observer: {
            value: '',
            label: '',
        },
        assignedBy: {
            value: '',
            label: '',
        },
    };
    const { values, submitForm, handleSubmit, setFieldValue, resetForm } = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const transferTaskObj = {
                    observerId: values.observer.value,
                    assignedById: value.assignedBy.value,
                    assignedToId: values.assignedTo.value,
                };
                await new ApiClient().patch(`task/${singleData?.id}/transfer`, transferTaskObj);
               dispatch(setTransferTaskModal({ open: false }));
                action.resetForm();
            } catch (error: any) {
                if (typeof error?.response?.data?.message === 'object') {
                    showToastAlert(error?.response?.data?.message.join(' , '));
                } else {
                    showToastAlert(error?.response?.data?.message);
                }
                showToastAlert(error?.response?.data?.message);
            }
            dispatch(setDisableBtn(false));
            dispatch(setFetching(false));
        },
    });

    const userDropdownList: SelectOptionsType[] = usersList?.map((item: UserListSecondaryEndpointType) => {
        return { value: item.id, label: `${item.firstName} ${item.lastName} (${item?.email})` };
    });

    return (
        <Modal
            open={transferTaskModal}
            onClose={() => dispatch(setTransferTaskModal({ open: false }))}
            onDiscard={() => {
                dispatch(setTransferTaskModal({ open: false }));
                resetForm();
            }}
            size="medium"
            onSubmit={() => submitForm()}
            title="Transfer Task"
            isBtnDisabled={values.assignedTo.value && values.observer.value && values.assignedBy.value && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-y-12">
                            <div>
                                <label htmlFor="taskAssignTo">Task Assign To</label>
                                <Select placeholder="Select task Assign To" options={userDropdownList} id="taskAssignTo" onChange={(e) => setFieldValue('assignedTo', e)} />
                            </div>
                            <div>
                                <label htmlFor="taskAssignBy">Task Assign By</label>
                                <Select placeholder="Select Task Assign By" options={userDropdownList} id="taskAssignBya" onChange={(e) => setFieldValue('assignedBy', e)} />
                            </div>
                            <div>
                                <label htmlFor="taskObserver">Task Observer</label>
                                <Select placeholder="Select task observer" options={userDropdownList} id="taskObserver" onChange={(e) => setFieldValue('observer', e)} />
                            </div>
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(TranserTaskModal);

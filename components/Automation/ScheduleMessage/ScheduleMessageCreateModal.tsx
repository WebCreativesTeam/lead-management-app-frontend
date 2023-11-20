import React, { memo } from 'react';
import Modal from '../../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/scheduleMessageSlice';
import { useFormik } from 'formik';
import { scheduleMessageSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../../__Shared/Loader';

const ScheduleMessageCreateModal = () => {
    const { createModal, isBtnDisabled, isFetching } = useSelector((state: IRootState) => state.scheduleMessage);

    const dispatch = useDispatch();
    const { values, handleChange, submitForm, handleSubmit, handleBlur, resetForm } = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: scheduleMessageSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().post('scheduleMessage', { name: value.name });
                dispatch(setCreateModal(false));
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
    return (
        <Modal
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={() => {
                dispatch(setCreateModal(false));
                resetForm();
            }}
            size="medium"
            onSubmit={() => submitForm()}
            title="Add Schedule Message"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="createScheduleName">Schedule Name</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                id="createScheduleName"
                                name="name"
                                type="text"
                                placeholder="Schedule Name"
                                className="form-input"
                            />
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(ScheduleMessageCreateModal);

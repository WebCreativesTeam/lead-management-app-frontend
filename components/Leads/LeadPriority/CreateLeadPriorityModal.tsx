import React, { memo, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadPrioritySlice';
import { useFormik } from 'formik';
import { leadPrioritySchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';

const CreatePriorityModal = () => {
    const { isBtnDisabled, createModal, isFetching } = useSelector((state: IRootState) => state.leadPriority);
    const [inputColor, setInputColor] = useState<string>('');

    const dispatch = useDispatch();
    const initialValues = {
        name: '',
    };
    const { values, handleChange, submitForm, handleSubmit, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: leadPrioritySchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const createLeadPriorityObj = {
                    name: value.name,
                    color: inputColor,
                };
                await new ApiClient().post('lead-priority', createLeadPriorityObj);
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
    const handleDiscard = () => {
        dispatch(setCreateModal(false));
        resetForm();
    };
    return (
        <Modal
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={handleDiscard}
            size="medium"
            onSubmit={() => submitForm()}
            title="Create Lead Priority"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="createLeadPriority">Lead Priority Name</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                id="createLeadPriority"
                                name="name"
                                type="text"
                                placeholder="Lead Priority Name"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="priorityColor">Lead Priority Color</label>
                            <input onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setInputColor(e.target.value)} id="createLeadPriority" name="color" type="color" />
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(CreatePriorityModal);

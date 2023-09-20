import React, { memo, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadStatusSlice';
import { useFormik } from 'formik';
import { leadStatusSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';

const CreateLeadStatusModal = () => {
    const { isBtnDisabled, createModal, isFetching } = useSelector((state: IRootState) => state.leadStatus);
    const [inputColor, setInputColor] = useState<string>('');

    const dispatch = useDispatch();
    const initialValues = {
        name: '',
    };
    const { values, handleChange, submitForm, handleSubmit, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: leadStatusSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const createLeadStatusObj = {
                    name: value.name,
                    color: inputColor,
                };
                await new ApiClient().post('lead-status', createLeadStatusObj);
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
            title="Create Lead Status"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="createLeadStatus">Lead Status Name</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                id="createLeadStatus"
                                name="name"
                                type="text"
                                placeholder="Lead Status Name"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="statusColor">Lead Status Color</label>
                            <input onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setInputColor(e.target.value)} id="statusColor" name="color" type="color" />
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(CreateLeadStatusModal);

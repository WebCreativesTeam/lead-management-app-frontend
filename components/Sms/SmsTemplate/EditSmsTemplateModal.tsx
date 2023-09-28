/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/smsTemplateSlice';
import { useFormik } from 'formik';
import { smsTemplateSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
const SmsTemplateEditModal = () => {
    const { editModal, singleData, isBtnDisabled, isFetching } = useSelector((state: IRootState) => state.smsTemplate);

    const dispatch = useDispatch();
    useEffect(() => {
        setFieldValue('name', singleData?.name);
        setFieldValue('message', singleData?.message);
    }, [singleData]);

    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues: {
            name: '',
            message: '',
        },
        validationSchema: smsTemplateSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('sms-template/' + singleData.id, { name: value.name, message: value.message });

                action.resetForm();
                dispatch(setEditModal({ open: false }));
            } catch (error: any) {
                if (typeof error?.response?.data?.message === 'object') {
                    showToastAlert(error?.response?.data?.message.join(' , '));
                } else if (error?.response?.data?.message) {
                    showToastAlert(error?.response?.data?.message);
                } else if (error?.response?.data) {
                    showToastAlert(error?.response?.data);
                }
                showToastAlert(error?.response?.data?.message);
            }
            dispatch(setDisableBtn(false));
            dispatch(setFetching(false));
        },
    });
    const handleDiscard = () => {
        dispatch(setEditModal({ open: false }));
        resetForm();
    };
    return (
        <Modal
            open={editModal}
            onClose={() => dispatch(setEditModal({ open: false }))}
            size="medium"
            onDiscard={handleDiscard}
            title="Edit Template"
            onSubmit={() => submitForm()}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={values.name && values.message && !isBtnDisabled ? false : true}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="SmsTemplateName">Name</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="SmsTemplateName" name="name" type="text" placeholder="Enter Name" className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="smsTemplateMessage"> Message</label>
                            <textarea
                                id="smsTemplateMessage"
                                rows={10}
                                className="form-textarea"
                                placeholder="Enter Message"
                                name="message"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.message}
                            ></textarea>
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(SmsTemplateEditModal);

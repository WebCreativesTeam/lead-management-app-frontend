/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/templateSlice/whatsappTemplateSlice';
import { useFormik } from 'formik';
import { whatsappTemplateSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
const WhatsappTemplateEditModal = () => {
    const { editModal, singleData, isBtnDisabled, isFetching } = useSelector((state: IRootState) => state.whatsappTemplate);

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
        validationSchema: whatsappTemplateSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('whatsapp-template/' + singleData.id, { name: value.name, message: value.message });

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
                            <label htmlFor="WhatsappTemplateName">Name</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="WhatsappTemplateName" name="name" type="text" placeholder="Enter Name" className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="whatsappTemplateMessage"> Message</label>
                            <textarea
                                id="whatsappTemplateMessage"
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

export default memo(WhatsappTemplateEditModal);

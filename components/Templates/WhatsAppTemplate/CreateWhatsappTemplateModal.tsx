import React, { memo } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/templateSlice/whatsappTemplateSlice';
import { useFormik } from 'formik';
import { whatsappTemplateSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';

const CreateWhatsappTemplateModal = () => {
    const { createModal, isBtnDisabled, isFetching } = useSelector((state: IRootState) => state.whatsappTemplate);

    const dispatch = useDispatch();
    const { values, handleChange, submitForm, handleSubmit, handleBlur, resetForm } = useFormik({
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
                await new ApiClient().post('whatsapp-template', { name: value.name, message: value.message });
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
            onSubmit={() => submitForm()}
            title="Create Whatsapp Template"
            isBtnDisabled={values.name && values.message && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
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

export default memo(CreateWhatsappTemplateModal);

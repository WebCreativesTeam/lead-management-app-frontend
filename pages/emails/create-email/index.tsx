import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmailSchema } from '@/utils/schemas';
import { IRootState } from '@/store';
import { setDisableBtn, setFetching } from '@/store/Slices/emailSlice/emailTemplateSlice';
import { ApiClient } from '@/utils/http';
import { useRouter } from 'next/router';
import { showToastAlert } from '@/utils/contant';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Loader from '@/components/__Shared/Loader';
const ReactQuill = dynamic(import('react-quill'), { ssr: false });

const SendEmailPage = () => {
    const dispatch = useDispatch();
    const { isBtnDisabled } = useSelector((state: IRootState) => state.emailTemplate);
    const [htmlTextLength, sethtmlTextLength] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { values, handleChange, handleSubmit, handleBlur, errors, setFieldValue } = useFormik({
        initialValues: {
            senderName: '',
            senderEmail: '',
            receiverEmail: '',
            subject: '',
            message: '',
        },
        validationSchema: sendEmailSchema,
        validateOnChange: true,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            setLoading(true);
            try {
                dispatch(setDisableBtn(true));
                const emailTemplateObj = {
                    senderName: value.senderName,
                    senderEmail: value.senderEmail,
                    receiverEmail: value.receiverEmail,
                    subject: value.subject,
                    message: value.message,
                };
                await new ApiClient().post('email', emailTemplateObj);
                router.push('/emails/email-logs');
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
            setLoading(false);
        },
    });

    const showAlert = async () => {
        if (errors.senderName) {
            showToastAlert(errors.senderName);
        } else if (errors.senderEmail) {
            showToastAlert(errors.senderEmail);
        } else if (errors.receiverEmail) {
            showToastAlert(errors.receiverEmail);
        } else if (errors.subject) {
            showToastAlert(errors.subject);
        }
    };

    return loading ? (
        <Loader />
    ) : (
        <>
            <div className="panel text-center text-xl font-bold sm:mx-auto sm:max-w-4xl"> Send Email</div>
            <form className="panel my-5 flex flex-col gap-y-6 sm:mx-auto sm:max-w-4xl" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1">
                        <label htmlFor="createName">Sender Name</label>
                        <input onChange={handleChange} onBlur={handleBlur} value={values.senderName} id="createName" name="senderName" type="text" placeholder="Sender Name" className="form-input" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="senderEmail">Sender Email</label>
                        <input
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.senderEmail}
                            id="senderEmail"
                            name="senderEmail"
                            type="email"
                            placeholder="Sender Emai"
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <label htmlFor="receiverEmail">Receiver Email</label>
                    <input
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.receiverEmail}
                        id="receiverEmail"
                        name="receiverEmail"
                        type="email"
                        placeholder="Receiver Email"
                        className="form-input"
                    />
                </div>
                <div>
                    <label htmlFor="createSubject">Subject</label>
                    <textarea
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.subject}
                        id="createSubject"
                        name="subject"
                        placeholder="Enter Subject"
                        className="form-textarea"
                        rows={3}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="createAttachments">Upload Attachments</label>
                    <input
                        id="createAttachments"
                        type="file"
                        className="rtl:file-ml-5 form-input cursor-pointer p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5"
                    />
                </div>
                <div>
                    <label htmlFor="createMessage">Message</label>
                    <ReactQuill
                        theme="snow"
                        id="createMessage"
                        value={values.message}
                        onChange={(e, delta, source, editor) => {
                            setFieldValue('message', e);
                            sethtmlTextLength(editor.getLength());
                        }}
                    />
                </div>

                <div className="mb-4 mt-8 flex items-center justify-center gap-4">
                    <button type="button" className="btn btn-outline-danger" onClick={() => router.push('/emails')} disabled={isBtnDisabled}>
                        Discard
                    </button>
                    <input
                        type="submit"
                        value={'Send Email'}
                        className="btn btn-primary  cursor-pointer"
                        disabled={values.senderName && values.senderEmail && values.subject && htmlTextLength > 1 && !isBtnDisabled ? false : true}
                        onClick={() => errors && showAlert()}
                    />
                </div>
            </form>
        </>
    );
};

export default SendEmailPage;

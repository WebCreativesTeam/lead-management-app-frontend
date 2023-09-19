import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { emailSchema } from '@/utils/schemas';
import { IRootState } from '@/store';
import { setDisableBtn, setFetching } from '@/store/Slices/emailSlice';
import { ApiClient } from '@/utils/http';
import { useRouter } from 'next/router';
import { showToastAlert } from '@/utils/contant';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Loader from '@/components/__Shared/Loader';
const ReactQuill = dynamic(import('react-quill'), { ssr: false });

const CreateEmailTemplate = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isBtnDisabled } = useSelector((state: IRootState) => state.emailTemplate);
    const [htmlTextLength, sethtmlTextLength] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const { values, handleChange, handleSubmit, handleBlur, resetForm, setFieldValue } = useFormik({
        initialValues: {
            name: '',
            subject: '',
            message: '',
        },
        validationSchema: emailSchema,
        validateOnChange: true,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            setLoading(true);
            try {
                dispatch(setDisableBtn(true));
                const emailTemplateObj = {
                    name: value.name,
                    subject: value.subject,
                    message: value.message,
                };
                await new ApiClient().post('email-template', emailTemplateObj);
                router.push('/email-templates');
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

    return loading ? (
        <Loader />
    ) : (
        <>
            <div className="panel text-center text-xl font-bold sm:mx-auto sm:max-w-4xl"> Create Email Template</div>
            <form className="panel my-5 flex flex-col gap-y-6 sm:mx-auto sm:max-w-4xl" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="createTemplateName">Template Name</label>
                    <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="createTemplateName" name="name" type="text" placeholder="Template Name" className="form-input" />
                </div>
                <div>
                    <label htmlFor="createTemplateSubject">Template Subject</label>
                    <textarea
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.subject}
                        id="createTemplateSubject"
                        name="subject"
                        placeholder="Template Subject"
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
                    <label htmlFor="createMessage">Template Message</label>
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
                        value={'Create Template'}
                        className="btn btn-primary  cursor-pointer"
                        disabled={values.name && values.subject && htmlTextLength > 1 && !isBtnDisabled ? false : true}
                    />
                </div>
            </form>
        </>
    );
};

export default CreateEmailTemplate;

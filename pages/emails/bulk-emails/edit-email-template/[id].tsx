/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
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
import { IEmails } from '@/utils/Types';
const ReactQuill = dynamic(import('react-quill'), { ssr: false });

const UpdateEmailTemplate = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isBtnDisabled } = useSelector((state: IRootState) => state.emails);
    const [htmlTextLength, sethtmlTextLength] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<IEmails>({} as IEmails);

    const { values, handleChange, handleSubmit, handleBlur, setFieldValue } = useFormik({
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
                await new ApiClient().patch('email-templates/' + router?.query?.id, emailTemplateObj);
                router.push('/emails/bulk-emails');
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
    const getEmailTemplate = async () => {
        setLoading(true);
        if (router.query.id) {
            const res: { status: string; data: IEmails } = await new ApiClient().get('email-templates/' + router.query.id);
            const email: IEmails = res?.data;
            setEmail(email);
            setLoading(false);
        }
    };
    useEffect(() => {
        getEmailTemplate();
    }, [router.query.id]);

    useEffect(() => {
        setFieldValue('name', email?.name);
        setFieldValue('subject', email?.subject);
        setFieldValue('message', email?.message);
    }, [email]);

    console.log('render');

    return loading ? (
        <Loader />
    ) : (
        <>
            <div className="panel text-center text-xl font-bold sm:mx-auto sm:max-w-4xl"> Edit Email Template</div>
            <form className="panel my-5 flex flex-col gap-y-6 sm:mx-auto sm:max-w-4xl" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="editTemplateName">Template Name</label>
                    <input onChange={handleChange} onBlur={handleBlur} value={values?.name} id="editTemplateName" name="name" type="text" placeholder="Template Name" className="form-input" />
                </div>
                <div>
                    <label htmlFor="editTemplateSubject">Template Subject</label>
                    <textarea
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.subject}
                        id="editTemplateSubject"
                        name="subject"
                        placeholder="Template Subject"
                        className="form-textarea"
                        rows={3}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="editAttachments">Upload Attachments</label>
                    <input
                        id="editAttachments"
                        type="file"
                        className="rtl:file-ml-5 form-input cursor-pointer p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5"
                    />
                </div>
                <div>
                    <label htmlFor="editMessage">Template Message</label>
                    <ReactQuill
                        theme="snow"
                        id="editMessage"
                        value={values?.message}
                        onChange={(e, delta, source, editor) => {
                            setFieldValue('message', e);
                            sethtmlTextLength(editor.getLength());
                        }}
                    />
                </div>
                <div className="mb-4 mt-8 flex items-center justify-center gap-4">
                    <button type="button" className="btn btn-outline-danger" onClick={() => router.push('/emails/bulk-emails')} disabled={isBtnDisabled}>
                        Discard
                    </button>
                    <input
                        type="submit"
                        value={'Edit Template'}
                        className="btn btn-primary  cursor-pointer"
                        disabled={values?.name && values?.subject && (htmlTextLength > 1 || values?.message?.length > 11) && !isBtnDisabled ? false : true}
                    />
                </div>
            </form>
        </>
    );
};

export default UpdateEmailTemplate;

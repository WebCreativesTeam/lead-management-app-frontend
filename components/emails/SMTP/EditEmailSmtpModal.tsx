/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/emailSlice/emailSmtpSlice';
import { useFormik } from 'formik';
import { editEmailSmtpSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import Select from 'react-select';
import { SelectOptionsType } from '@/utils/Types';
import { SMTPList, SMTPSecurityList } from '@/utils/Raw Data';

const EmailSmtpUpdateModal = () => {
    const { editModal, isBtnDisabled, isFetching, singleData } = useSelector((state: IRootState) => state.emailSmtp);
    const dispatch = useDispatch();
    const [security, setSecurity] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultSMTP, setDefaultSMTP] = useState<SelectOptionsType>({} as SelectOptionsType);

    useEffect(() => {
        const { email, SMTP, name, security, host, port } = singleData;
        setFieldValue('email', email);
        setFieldValue('name', name);
        setFieldValue('SMTP', SMTP);
        setFieldValue('security', security);
        setFieldValue('host', host);
        setFieldValue('port', port);

        const findSMTP: SelectOptionsType | undefined = SMTPList.find((item: SelectOptionsType) => item.value === SMTP);
        if (findSMTP) {
            setDefaultSMTP(findSMTP);
        }
        const findSecurity: SelectOptionsType | undefined = SMTPSecurityList.find((item: SelectOptionsType) => item.value === security);
        if (findSecurity) {
            setSecurity(findSecurity);
        }
    }, [singleData]);

    const { values, handleChange, submitForm, handleSubmit, errors, handleBlur, resetForm, setFieldValue } = useFormik({
        initialValues: {
            SMTP: '',
            name: '',
            email: '',
            security: '',
            password: '',
            confirmPassword: '',
            host: '',
            port: '',
        },
        validationSchema: editEmailSmtpSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            const editSmtpObj = {
                SMTP: value.SMTP,
                security: value.SMTP !== 'Outlook' ? 'none' : value.security,
                global: false,
                verified: false,
                name: value.name,
                email: value.email,
                password: value.password,
                host: value.host,
                port: value.port,
            };
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch(`smtp/${singleData?.id}`, editSmtpObj);
                dispatch(setEditModal({ open: false }));
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
        dispatch(setEditModal({ open: false }));
        resetForm();
    };

    const showAlert = async () => {
        if (errors.name) {
            showToastAlert(errors.name);
        } else if (errors.email) {
            showToastAlert(errors.email);
        } else if (errors.password) {
            showToastAlert(errors.password);
        } else if (errors.confirmPassword) {
            showToastAlert(errors.confirmPassword);
        }
    };
    return (
        <Modal
            open={editModal}
            onClose={() => {
                dispatch(setEditModal({ open: false }));
            }}
            onDiscard={handleDiscard}
            size="large"
            onSubmit={() => {
                errors && showAlert();
                submitForm();
            }}
            title="Update SMTP"
            isBtnDisabled={values.SMTP && values.name && values.email && values.password && values.confirmPassword && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="state">Select SMTP</label>
                                <Select placeholder="SMTP" options={SMTPList} onChange={(data: any) => setFieldValue('SMTP', data.value)} defaultValue={defaultSMTP}/>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="name">SMTP Name</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="name" name="name" type="text" placeholder="SMTP Name" className="form-input" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="smtpHost">Host</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.host} id="smtpHost" name="host" type="text" placeholder="Enter Host" className="form-input" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="smtpPort">Port</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.port} id="smtpPort" name="port" type="text" placeholder="Emter Port" className="form-input" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="state">Security</label>
                                <Select
                                    placeholder="Security"
                                    options={SMTPSecurityList}
                                    onChange={(data: any) => {
                                        setSecurity({ value: data.value, label: data.value });
                                        setFieldValue('security', data.value);
                                    }}
                                    value={values.SMTP !== 'Outlook' ? { value: 'none', label: 'none' } : security}
                                    isDisabled={values.SMTP === 'Outlook' ? false : true}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="passwordSmtp">Password</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    id="passwordSmtp"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="form-input"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="confirmPasswordSmtp">Confirm password</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmPassword}
                                    id="confirmPasswordSmtp"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(EmailSmtpUpdateModal);

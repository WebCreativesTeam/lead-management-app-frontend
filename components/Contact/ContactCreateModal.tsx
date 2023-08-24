import React, { memo } from 'react';
import Modal from '../__Shared/Modal';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/contactSlice';
import { countryData, namePrefix } from '@/utils/Raw Data';
import { useFormik } from 'formik';
import { contactSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';

const ContactCreateModal = () => {
    const createModal: boolean = useSelector((state: IRootState) => state.contacts.createModal);
    const isBtnDisabled: boolean = useSelector((state: IRootState) => state.contacts.isBtnDisabled);
    const dispatch = useDispatch();
    const initialValues = {
        name: '',
        title: '',
        phoneNumber: '',
        email: '',
        assignedTo: '',
        source: '',
        website: '',
        position: '',
        industry: '',
        facebookProfile: '',
        twitterProfile: '',
        comment: '',
        address: '',
        city: '',
        state: '',
        country: '',
    };
    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: contactSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const { address, assignedTo, city, comment, country, email, facebookProfile, industry, name, phoneNumber, position, source, state, title, twitterProfile, website } = value;
                const createContactObj = {
                    title,
                    name,
                    phoneNumber,
                    email,
                    assignedTo,
                    source,
                    website,
                    position,
                    industry,
                    facebookProfile,
                    twitterProfile,
                    comment,
                    location: {
                        address,
                        city,
                        state,
                        country,
                    },
                };
                await new ApiClient().post('contacts', createContactObj);
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
            size="large"
            onSubmit={() => submitForm()}
            title="Create Contact"
            isBtnDisabled={
                values.name &&
                values.title &&
                values.address &&
                values.city &&
                values.state &&
                values.country &&
                values.source &&
                values.assignedTo &&
                values.industry &&
                values.position &&
                values.facebookProfile &&
                values.twitterProfile &&
                values.comment &&
                !isBtnDisabled
                    ? false
                    : true
            }
            disabledDiscardBtn={isBtnDisabled}
            content={
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="state">Prefix</label>
                            <Select placeholder="Prefix" options={namePrefix} onChange={(data: any) => setFieldValue('title', data.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="createContactName">Contact Name</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="createContactName" name="name" type="text" placeholder="Contact Name" className="form-input" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="createPhoneNo"> Phone Number</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phoneNumber}
                                id="createPhoneNo"
                                name="phoneNumber"
                                type="text"
                                placeholder="Phone Number"
                                className="form-input"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="createEmail">Email</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.email} id="createEmail" name="email" type="email" placeholder="Your Email" className="form-input" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="createAssignedTo">Assign To</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.assignedTo}
                                id="createAssignedTo"
                                name="assignedTo"
                                type="text"
                                placeholder="Assign To"
                                className="form-input"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="createSource">Source</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.source} id="createSource" name="source" type="text" placeholder="Source" className="form-input" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="designation">Position</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.position} id="designation" name="position" type="text" placeholder="Position" className="form-input" />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="createIndustry">Industry</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.industry} id="createIndustry" name="industry" type="text" placeholder="Industry" className="form-input" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="createFacebookProfile">FacebookProfile</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.facebookProfile}
                                id="createIndustry"
                                name="facebookProfile"
                                type="text"
                                placeholder="FacebookProfile"
                                className="form-input"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="createTwitterProfile">TwitterProfile</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.twitterProfile}
                                id="createTwitterProfile"
                                name="twitterProfile"
                                type="text"
                                placeholder="TwitterProfile"
                                className="form-input"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="createWebsite">Website</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.website} id="createWebsite" name="website" type="text" placeholder="Website" className="form-input" />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="createAddress">Address</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.address} id="createAddress" name="address" type="text" placeholder="Address" className="form-input" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="state">Country</label>
                            <Select placeholder="select country" options={countryData} onChange={(data: any) => setFieldValue('country', data.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="state">State</label>
                            <Select placeholder="select state" options={countryData} onChange={(data: any) => setFieldValue('state', data.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="state">City</label>
                            <Select placeholder="select city" options={countryData} onChange={(data: any) => setFieldValue('city', data.value)} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="contactComment"> Comment</label>
                        <textarea
                            id="contactComment"
                            rows={5}
                            className="form-textarea"
                            placeholder="Enter Your Comment"
                            name="comment"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.comment}
                        ></textarea>
                    </div>
                </form>
            }
        />
    );
};

export default memo(ContactCreateModal);

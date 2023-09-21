import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/contactSlice';
import { namePrefix } from '@/utils/Raw Data';
import { useFormik } from 'formik';
import { contactSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../__Shared/Loader';
import { SelectOptionsType, SourceDataType, UserDataType, ICountryData } from '@/utils/Types';
import countryJson from '@/utils/Raw Data/select-address.json';

const ContactCreateModal = () => {
    const { isFetching, createModal, isBtnDisabled, usersList, sourceList } = useSelector((state: IRootState) => state.contacts);
    const dispatch = useDispatch();
    const [countries, setCountries] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [states, setStates] = useState<SelectOptionsType[] | undefined>([] as SelectOptionsType[]);

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
    const { values, handleChange, submitForm, handleSubmit, setFieldValue, handleBlur, resetForm } = useFormik({
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
                    assignedToId: assignedTo,
                    sourceId: source,
                    website,
                    position,
                    industry,
                    facebookProfile,
                    twitterProfile,
                    comment,
                    location: {
                        address,
                        city,
                        country,
                        state,
                    },
                };
                await new ApiClient().post('contact', createContactObj);
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

    useEffect(() => {
        const creatCountryJsonList: SelectOptionsType[] = countryJson.countries.map((data: ICountryData) => {
            return { value: data.country, label: data.country };
        });
        setCountries(creatCountryJsonList);

        const findSelectedCountryStates: ICountryData | undefined = countryJson?.countries?.find((data) => {
            return data.country === values.country;
        });

        if (findSelectedCountryStates) {
            const findStates: SelectOptionsType[] = findSelectedCountryStates.states.map((state: string) => {
                return { value: state, label: state };
            });
            setStates(findStates);
        }
    }, [values.country]);

    const assignToUsersDropdown: SelectOptionsType[] = usersList?.map((item: UserDataType) => {
        return { value: item.id, label: `${item.firstName} ${item.lastName}` };
    });

    const sourceDropdown: SelectOptionsType[] = sourceList?.map((item: SourceDataType) => {
        return { value: item.id, label: item.name };
    });

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
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="state">Prefix</label>
                                <Select placeholder="Prefix" options={namePrefix} onChange={(data: any) => setFieldValue('title', data.value)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="createContactName">Contact Name</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    id="createContactName"
                                    name="name"
                                    type="text"
                                    placeholder="Contact Name"
                                    className="form-input"
                                />
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
                                <label htmlFor="state">Assign To</label>
                                <Select placeholder="Assign To" options={assignToUsersDropdown} onChange={(data: any) => setFieldValue('assignedTo', data.value)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="state">Source</label>
                                <Select placeholder="Select Source" options={sourceDropdown} onChange={(data: any) => setFieldValue('source', data.value)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="designation">Position</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.position} id="designation" name="position" type="text" placeholder="Position" className="form-input" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="createIndustry">Industry</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.industry}
                                    id="createIndustry"
                                    name="industry"
                                    type="text"
                                    placeholder="Industry"
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="createFacebookProfile">FacebookProfile</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.facebookProfile}
                                    id="createFacebookProfile"
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
                                <label htmlFor="country">Country</label>
                                <Select placeholder="select country" options={countries} onChange={(data: any) => setFieldValue('country', data.value)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="state">State</label>
                                <Select placeholder="select state" options={states} onChange={(data: any) => setFieldValue('state', data.value)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="city">City</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.city} id="city" name="city" type="text" placeholder="Enter City Name" className="form-input" />
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
                )
            }
        />
    );
};

export default memo(ContactCreateModal);

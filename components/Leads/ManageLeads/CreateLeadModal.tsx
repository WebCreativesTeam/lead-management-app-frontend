/* eslint-disable @next/next/no-img-element */
import React, { Fragment, memo } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/manageLeadSlice';
import { useFormik } from 'formik';
import { leadSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {
    SelectOptionsType,
    BranchListSecondaryEndpoint,
    SourceDataType,
    ContactListSecondaryEndpoint,
    LeadPrioritySecondaryEndpoint,
    UserListSecondaryEndpointType,
    ICustomField,
} from '@/utils/Types';
import { Tab } from '@headlessui/react';
import { Home, Phone, Note, Setting } from '@/utils/icons';

const LeadCreateModal = () => {
    const dispatch = useDispatch();
    const { isFetching, createModal, isBtnDisabled, leadPriorityList, leadBranchList, leadContactsList, leadSourceList, leadUserList, customFieldsList } = useSelector(
        (state: IRootState) => state.lead
    );

    const initialValues = {
        name: '',
        phoneNumber: '',
        reference: '',
        priority: {
            value: '',
            label: '',
        },
        estimatedDate: '',
        estimatedBudget: '',
        branch: {
            value: '',
            label: '',
        },
        contact: {
            value: '',
            label: '',
        },
        source: {
            value: '',
            label: '',
        },
        description: '',
        DOB: '',
        facebookCampaignName: '',
        serviceInterestedIn: '',
        job: '',
        occupation: '',
        id: '',
    };
    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: leadSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const createLeadObj = {
                    estimatedDate: new Date(value.estimatedDate).toISOString(),
                    description: value.description,
                    estimatedBudget: +value.estimatedBudget,
                    sourceId: values.source.value,
                    priorityId: values.priority.value,
                    branchId: value.branch.value,
                    contactId: values.contact.value,
                    reference: value.reference,
                    DOB: new Date(value.DOB).toISOString(),
                    facebookCampaignName: value.facebookCampaignName,
                    serviceInterestedIn: value.serviceInterestedIn,
                    job: value.job,
                };
                console.log(createLeadObj);
                await new ApiClient().post('lead', createLeadObj);
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

    const leadPriorityDropdown: SelectOptionsType[] = leadPriorityList?.map((item: LeadPrioritySecondaryEndpoint) => {
        return {
            value: item.id,
            label: (
                <>
                    <span className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: item?.color, backgroundColor: item?.color + '20' }}>
                        {item?.name}
                    </span>
                </>
            ),
        };
    });
    const userListDropdown: SelectOptionsType[] = leadUserList?.map((item: UserListSecondaryEndpointType) => {
        return { value: item.id, label: `${item.firstName} ${item.lastName} (${item?.email})` };
    });

    const leadBranchDropdown: SelectOptionsType[] = leadBranchList?.map((item: BranchListSecondaryEndpoint) => {
        return { value: item.id, label: item.name };
    });

    const leadContactDropdown: SelectOptionsType[] = leadContactsList?.map((item: ContactListSecondaryEndpoint) => {
        return { value: item.id, label: `${item.name} (${item?.email})` };
    });

    const leadSourceDropdown: SelectOptionsType[] = leadSourceList?.map((item: SourceDataType) => {
        return { value: item.id, label: item.name };
    });

    const showAlert = async () => {
        if (errors.description) {
            showToastAlert(errors.description);
        } else if (errors.reference) {
            showToastAlert(errors.reference);
        } else if (errors.job) {
            showToastAlert(errors.job);
        } else if (errors.estimatedBudget) {
            showToastAlert(errors.estimatedBudget);
        } else if (errors.facebookCampaignName) {
            showToastAlert(errors.facebookCampaignName);
        } else if (errors.serviceInterestedIn) {
            showToastAlert(errors.serviceInterestedIn);
        }
    };

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
            size="large"
            onSubmit={() => {
                errors && showAlert();
                submitForm();
            }}
            title="Create Lead"
            isBtnDisabled={
                values.DOB &&
                values.contact.value &&
                values.estimatedDate &&
                values.source.value &&
                values.branch.value &&
                values.priority.value &&
                values.description &&
                values.estimatedBudget &&
                values.reference &&
                values.facebookCampaignName &&
                values.serviceInterestedIn &&
                values.job &&
                !isBtnDisabled
                    ? false
                    : true
            }
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <Fragment>
                        <Tab.Group>
                            <Tab.List className="mb-8 flex flex-wrap gap-2">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${
                                                selected ? 'bg-green-600 text-white shadow-xl !outline-none' : ''
                                            } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2 before:inline-block hover:bg-green-600 hover:text-white`}
                                        >
                                            <Home />
                                            Overview
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${
                                                selected ? 'bg-green-600 text-white shadow-xl !outline-none' : ''
                                            } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2 before:inline-block hover:bg-green-600 hover:text-white`}
                                        >
                                            <Setting />
                                            Custom Fields
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${
                                                selected ? 'bg-green-600 text-white  shadow-xl !outline-none' : ''
                                            } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2  before:inline-block hover:bg-green-600 hover:text-white`}
                                        >
                                            <Note />
                                            Note
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${
                                                selected ? 'bg-green-600 text-white shadow-xl !outline-none' : ''
                                            } -mb-[1px] flex flex-1 items-center justify-center gap-1 rounded-lg p-3.5 py-2 before:inline-block hover:bg-green-600 hover:text-white`}
                                        >
                                            <Phone />
                                            Log
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>
                                {/* overview form :start */}
                                <Tab.Panel>
                                    <form className="space-y-5" onSubmit={handleSubmit}>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="name">Name</label>
                                                <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="name" name="name" type="text" placeholder="Name" className="form-input" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="phoneNumber">Phone Number</label>
                                                <input
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.phoneNumber}
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    type="tel"
                                                    placeholder="Phone Number"
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="leadSource"> Source</label>
                                                <Select placeholder="Select Source" options={leadSourceDropdown} id="leadSource" onChange={(e) => setFieldValue('source', e)} />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="leadSource">Product</label>
                                                <Select placeholder="Product" options={leadSourceDropdown} id="leadSource" onChange={(e) => setFieldValue('source', e)} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="leadStatus">Lead Status</label>
                                                <Select placeholder="Select lead Status" options={leadPriorityDropdown} id="leadStatus" onChange={(e) => setFieldValue('priority', e)} />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="leadPriority">Lead Priority</label>
                                                <Select placeholder="Select lead priority" options={leadPriorityDropdown} id="leadPriority" onChange={(e) => setFieldValue('priority', e)} />
                                            </div>

                                            {/* <div className="flex-1">
                                                <label htmlFor="leadContact">Lead Contact</label>
                                                <Select placeholder="Select Contact" options={leadContactDropdown} id="leadContact" onChange={(e) => setFieldValue('contact', e)} />
                                            </div> */}
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label>Created Date</label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'Y-m-d H:i',
                                                        position: 'auto',
                                                    }}
                                                    id="taskStartDate"
                                                    placeholder="Task Start Date"
                                                    name="startDate"
                                                    className="form-input"
                                                    onChange={(e) => setFieldValue('startDate', e)}
                                                    // value={values.startDate}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label>Last Update</label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'Y-m-d H:i',
                                                        position: 'auto',
                                                    }}
                                                    id="taskEndDate"
                                                    placeholder="Task End Date"
                                                    name="endDate"
                                                    className="form-input"
                                                    onChange={(e) => setFieldValue('endDate', e)}
                                                    // value={values.endDate}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label>Next Follow Up</label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'Y-m-d H:i',
                                                        position: 'auto',
                                                    }}
                                                    id="taskStartDate"
                                                    placeholder="Task Start Date"
                                                    name="startDate"
                                                    className="form-input"
                                                    onChange={(e) => setFieldValue('startDate', e)}
                                                    // value={values.startDate}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    // value={values.email}
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label>Alternative Mobile Number</label>
                                                <input
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    // value={values.email}
                                                    id="email"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="Alternative Mobile No"
                                                    className="form-input"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="createAddress">Address</label>
                                                <input
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    // value={values.address}
                                                    id="createAddress"
                                                    name="address"
                                                    type="text"
                                                    placeholder="Address"
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="city">City</label>
                                                <Select
                                                    placeholder="city"
                                                    // value={selectState && selectedCountry.includes(selectState.value) ? selectState : null}
                                                    // options={states}
                                                    // onChange={(data: any) => {
                                                    //     setFieldValue('state', data.value);
                                                    //     setSelectState({ value: data.value, label: data.value });
                                                    // }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="zipCode">Zip Code</label>
                                                <input
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    // value={values.address}
                                                    id="zipCode"
                                                    name="zipCode"
                                                    type="text"
                                                    placeholder="Zip Code"
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="state">State</label>
                                                <Select
                                                    placeholder="Select State"
                                                    // value={selectState && selectedCountry.includes(selectState.value) ? selectState : null}
                                                    // options={states}
                                                    // onChange={(data: any) => {
                                                    //     setFieldValue('state', data.value);
                                                    //     setSelectState({ value: data.value, label: data.value });
                                                    // }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="subProduct">Sub Product</label>
                                                <Select placeholder="Sub Product" options={leadSourceDropdown} id="subProduct" onChange={(e) => setFieldValue('source', e)} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="color">Color</label>
                                                <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="color" name="color" type="text" placeholder="Color" className="form-input" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="occupation">Occupation</label>
                                                <input
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.occupation}
                                                    id="occupation"
                                                    name="occupation"
                                                    type="text"
                                                    placeholder="Occupation"
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="state">Gender</label>
                                                <Select
                                                    placeholder="gender"
                                                    // value={selectState && selectedCountry.includes(selectState.value) ? selectState : null}
                                                    // options={states}
                                                    // onChange={(data: any) => {
                                                    //     setFieldValue('state', data.value);
                                                    //     setSelectState({ value: data.value, label: data.value });
                                                    // }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label>DOB</label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'Y-m-d H:i',
                                                        position: 'auto',
                                                    }}
                                                    id="birthdate"
                                                    placeholder="Date of birth"
                                                    name="birthdate"
                                                    className="form-input"
                                                    onChange={(e) => setFieldValue('endDate', e)}
                                                    // value={values.endDate}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label>Wedding Day</label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'Y-m-d H:i',
                                                        position: 'auto',
                                                    }}
                                                    id="weddingDate"
                                                    placeholder="Task Start Date"
                                                    name="weddingDate"
                                                    className="form-input"
                                                    onChange={(e) => setFieldValue('weddingDate', e)}
                                                    // value={values.startDate}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label>Estimate Purchase Date</label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'Y-m-d H:i',
                                                        position: 'auto',
                                                    }}
                                                    id="estimatePurchaseDate"
                                                    placeholder="Estimate Purchase Date"
                                                    name="estimatePurchaseDate"
                                                    className="form-input"
                                                    onChange={(e) => setFieldValue('estimatePurchaseDate', e)}
                                                    // value={values.endDate}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="branch">Branch</label>
                                                <Select placeholder="Select Branch" options={leadSourceDropdown} id="branch" onChange={(e) => setFieldValue('branch', e)} />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="state">Lead Assign</label>
                                                <Select placeholder="Assign To" options={userListDropdown} onChange={(data: any) => setFieldValue('leadAssign', data.value)} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="state">Tele Caller</label>
                                            <Select placeholder="Tele Caller" options={userListDropdown} onChange={(data: any) => setFieldValue('teleCaller', data.value)} />
                                        </div>
                                    </form>
                                </Tab.Panel>
                                {/* overview form :end */}

                                {/* Custom fields tab : start */}
                                <Tab.Panel>
                                    <form className="space-y-5" onSubmit={handleSubmit}>
                                        {/* <div className="flex flex-col gap-4 sm:flex-row">
                                                <div className="flex-1">
                                                    <label htmlFor="vehicleModel">Vehicle Model</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="vehicleModel"
                                                        name="vehicleModel"
                                                        type="text"
                                                        placeholder="Vehicle Model"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor="vehicleYear">Vehicle Year</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="vehicleYear"
                                                        name="vehicleYear"
                                                        type="number"
                                                        placeholder="Vehicle Year"
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <div className="flex-1">
                                                    <label htmlFor="vehicleMileage">Vehicle Mileage</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="vehicleMileage"
                                                        name="vehicleMileage"
                                                        type="number"
                                                        placeholder="Vehicle Mileage"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor="engineType">Engine Type</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="engineType"
                                                        name="engineType"
                                                        type="text"
                                                        placeholder="Engine Type"
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <div className="flex-1">
                                                    <label htmlFor="fuelType">Fuel Type</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="fuelType"
                                                        name="fuelType"
                                                        type="number"
                                                        placeholder="Fuel Type"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor="transmissionType">Transmission Type</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="transmissionType"
                                                        name="transmissionType"
                                                        type="text"
                                                        placeholder="Transmission Type"
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <div className="flex-1">
                                                    <label htmlFor="customFieldColor">Color</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="customFieldColor"
                                                        name="customFieldColor"
                                                        type="text"
                                                        placeholder="Color"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor="previousOwner">Previous Owner</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="previousOwner"
                                                        name="previousOwner"
                                                        type="text"
                                                        placeholder="Previous Owner"
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <div className="flex-1">
                                                    <label htmlFor="currentOwner">Current Owner</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="currentOwner"
                                                        name="currentOwner"
                                                        type="text"
                                                        placeholder="Current Owner"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor="vehicleGPSLocation">Vehicle GPS Location</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="vehicleGPSLocation"
                                                        name="vehicleGPSLocation"
                                                        type="text"
                                                        placeholder="Vehicle GPS Location"
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <div className="flex-1">
                                                    <label>Purchase Date</label>
                                                    <Flatpickr
                                                        data-enable-time
                                                        options={{
                                                            enableTime: true,
                                                            dateFormat: 'Y-m-d H:i',
                                                            position: 'auto',
                                                        }}
                                                        placeholder="Purchase Date"
                                                        name="purchaseDate"
                                                        className="form-input"
                                                        onChange={(e) => setFieldValue('purchaseDate', e)}
                                                        // value={values.endDate}
                                                    />
                                                </div>
                                                <div className="flex-1 ">
                                                    <label>Certified Pre-owned</label>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <label className="inline-flex">
                                                                <input type="checkbox" className="form-checkbox" defaultChecked />
                                                                <span>Yes</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex">
                                                                <input type="checkbox" className="form-checkbox" />
                                                                <span>No</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <div className="flex-1">
                                                    <label htmlFor="currentOwner">Upload Vehicle Image</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="currentOwner"
                                                        name="currentOwner"
                                                        type="file"
                                                        placeholder="Current Owner"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="flex-1 ">
                                                    <label>Certified Pre-owned</label>
                                                    <div className="flex items-center    gap-3">
                                                        <div>
                                                            <label className="inline-flex">
                                                                <input type="radio" className="peer form-checkbox rounded-full" name="vehicleCondition" />
                                                                <span>Excellent</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex">
                                                                <input type="radio" className="peer form-checkbox rounded-full text-success" name="vehicleCondition" />
                                                                <span className="peer-checked:text-success">Good</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex">
                                                                <input type="radio" className="peer form-checkbox rounded-full" name="vehicleCondition" />
                                                                <span>Fair</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        <section className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                                            {customFieldsList?.map((item: ICustomField, index: number) => {
                                                return (
                                                    <div key={index}>
                                                        <label htmlFor={item?.id}>{item?.label}</label>
                                                        {item?.fieldType === 'TEXT' && (
                                                            <input
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.id}
                                                                id={item?.id}
                                                                name={item?.id}
                                                                type="text"
                                                                placeholder={item?.label}
                                                                className="form-input"
                                                            />
                                                        )}
                                                        {item?.fieldType === 'NUMBER' && (
                                                            <input
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.id}
                                                                id={item?.id}
                                                                name={item?.id}
                                                                type="number"
                                                                placeholder={'Enter ' + item?.label}
                                                                className="form-input"
                                                            />
                                                        )}
                                                        {item?.fieldType === 'FILE' && (
                                                            <input
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.name}
                                                                id={item?.id}
                                                                name={item?.id}
                                                                type="file"
                                                                placeholder={'Enter ' + item?.label}
                                                                className="form-input"
                                                            />
                                                        )}
                                                        {item?.fieldType === 'SELECT' && (
                                                            <Select
                                                                placeholder={`Select ${item?.label}`}
                                                                options={item?.options?.map((item) => {
                                                                    return { label: item.name, value: item.value };
                                                                })}
                                                                onChange={(data: any) => setFieldValue('country', data.value)}
                                                            />
                                                        )}
                                                        {item?.fieldType === 'DATE' && (
                                                            <Flatpickr
                                                                data-enable-time
                                                                options={{
                                                                    enableTime: true,
                                                                    dateFormat: 'Y-m-d H:i',
                                                                    position: 'auto',
                                                                }}
                                                                id={item?.id}
                                                                placeholder={`Select ${item?.label}`}
                                                                name={item?.id}
                                                                className="form-input"
                                                                onChange={(e) => setFieldValue(item?.id, e)}
                                                                // value={values.startDate}
                                                            />
                                                        )}
                                                        {item?.fieldType === 'RADIO' && (
                                                            <div className="flex gap-x-5">
                                                                {item?.options?.map((item2, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            <input type="radio" name={item?.id} className="peer form-radio" id={item?.id} value={item2?.value} />
                                                                            <label className="inline-flex" htmlFor={item?.id}>
                                                                                {item2?.name}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        {item?.fieldType === 'CHECKBOX' && (
                                                            <div className="flex gap-x-5 items-center">
                                                                {item?.options?.map((item2, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            <input
                                                                                type="checkbox"
                                                                                name={item?.id + index}
                                                                                className="form-checkbox"
                                                                                id={item?.id + index}
                                                                                value={item2?.value + index}
                                                                            />
                                                                            <label className="inline-flex" htmlFor={item?.id}>
                                                                                {item2?.name}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </section>
                                    </form>
                                </Tab.Panel>
                                {/* custom fields tab :end */}

                                {/* Notes tab content : start */}
                                <Tab.Panel>
                                    <div className="mb-5">
                                        <p className="mb-5 text-base font-bold text-white-dark">Today</p>
                                        <div className="sm:flex">
                                            <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                <img src="/assets/images/profile-16.jpeg" alt="img" className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-center text-xl font-bold text-primary ltr:sm:text-left rtl:sm:text-right">Laurie Fox</h4>

                                                <div className="mb-16 mt-4 sm:mt-7">
                                                    <h6 className="mb-2 inline-block text-lg font-bold">Trending Style</h6>
                                                    <p className="font-semibold text-white-dark ltr:pl-8 rtl:pr-8">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:flex">
                                            <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                <img src="/assets/images/profile-7.jpeg" alt="img" className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-center text-xl font-bold text-primary ltr:sm:text-left rtl:sm:text-right">Justin Cross</h4>

                                                <div className="mb-16 mt-4 sm:mt-7">
                                                    <h6 className="mb-2 inline-block text-lg font-bold">Nature Photography</h6>
                                                    <p className="font-semibold text-white-dark ltr:pl-8 rtl:pr-8">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:flex">
                                            <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                <img src="/assets/images/profile-16.jpeg" alt="img" className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-center text-xl font-bold text-primary ltr:sm:text-left rtl:sm:text-right">Laurie Fox</h4>

                                                <div className="mb-16 mt-4 sm:mt-7">
                                                    <h6 className="mb-2 inline-block text-lg font-bold">Create new Project</h6>
                                                    <p className="font-semibold text-white-dark ltr:pl-8 rtl:pr-8">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                {/* Notes tab content : end */}

                                {/* logs tab content : start */}
                                <Tab.Panel>
                                    <div className="mb-5">
                                        <div className="mx-auto max-w-[900px]">
                                            <div className="flex">
                                                <p className="mr-3 w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">2 Days Ago</p>
                                                <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-primary after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-primary"></div>
                                                <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">Call with John Doe</p>
                                                    <p className="min-w-[100px] max-w-[100px] self-center text-xs font-bold text-white-dark">Duration :25 mins</p>
                                                    <audio controls muted>
                                                        <source src="horse.ogg" type="audio/ogg" />
                                                        <source src="horse.mp3" type="audio/mpeg" />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <p className="mr-3 w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">2 Days Ago</p>
                                                <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-secondary after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-secondary"></div>
                                                <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">Whatsapp With Jane Smith</p>
                                                    <p className="min-w-[100px] self-center text-xs font-bold text-white-dark">Last Message: Birthday wish content</p>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <p className="mr-3 w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">2 Days Ago</p>
                                                <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-success after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-success"></div>
                                                <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">Email to HR and Admin</p>
                                                    <p className="min-w-[100px]  self-center text-xs font-bold text-white-dark">Last Message: Birthday wish content</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                {/* logs tab content : end */}
                            </Tab.Panels>
                        </Tab.Group>
                    </Fragment>
                )
            }
        />
    );
};

export default memo(LeadCreateModal);

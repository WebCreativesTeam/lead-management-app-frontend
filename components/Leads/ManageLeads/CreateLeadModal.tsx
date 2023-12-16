/* eslint-disable @next/next/no-img-element */
import React, { Fragment, memo, useEffect, useState } from 'react';
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
    LeadStatusSecondaryEndpoint,
} from '@/utils/Types';
import { Tab } from '@headlessui/react';
import { Home, Phone, Note, Setting } from '@/utils/icons';
import CustomFieldsTab from './CustomFieldsTab';

const LeadCreateModal = () => {
    const dispatch = useDispatch();
    const { isFetching, createModal, isBtnDisabled, leadPriorityList, leadBranchList, leadContactsList, leadSourceList, leadUserList, leadProductList, leadStatusList } = useSelector(
        (state: IRootState) => state.lead
    );
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);

    const initialValues = {
        name: '',
        phoneNumber: '',
        reference: '',
        priority: {
            value: '',
            label: '',
        },
        status: {
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
        product: {
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
        contactDate: '',
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
                    statusId: values.status.value,
                    branchId: value.branch.value,
                    contactId: values.contact.value,
                    productId: values.product.value,
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

    const leadStatusDropdown: SelectOptionsType[] = leadStatusList?.map((item: LeadStatusSecondaryEndpoint) => {
        return {
            value: item.id,
            label: (
                <div className={`rounded px-2.5 py-0.5 text-center text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: item?.color, backgroundColor: item?.color + '20' }}>
                    {item?.name}
                </div>
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

    useEffect(() => {
        const createProductDropdown: SelectOptionsType[] = leadProductList?.map((item) => {
            return { label: item?.name, value: item?.id };
        });
        setProductDropdown(createProductDropdown);
    }, [leadProductList]);

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
                                                <label htmlFor="leadProduct">Product</label>
                                                <Select placeholder="Product" options={productDropdown} id="leadProduct" onChange={(e) => setFieldValue('product', e)} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="leadStatus">Lead Status</label>
                                                <Select placeholder="Select lead Status" options={leadStatusDropdown} id="leadStatus" onChange={(e) => setFieldValue('status', e)} />
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
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1">
                                                <label htmlFor="state">Tele Caller</label>
                                                <Select placeholder="Tele Caller" options={userListDropdown} onChange={(data: any) => setFieldValue('teleCaller', data.value)} />
                                            </div>
                                            <div className="flex-1">
                                                <label>Contact Date</label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'Y-m-d H:i',
                                                        position: 'auto',
                                                    }}
                                                    id="contactDate"
                                                    placeholder="Contact Date"
                                                    name="contactDate"
                                                    className="form-input"
                                                    onChange={(e) => setFieldValue('contactDate', e)}
                                                    value={values.contactDate}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </Tab.Panel>
                                {/* overview form :end */}

                                {/* Custom fields tab : start */}
                                <Tab.Panel>
                                    <CustomFieldsTab />
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

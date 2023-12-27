/* eslint-disable @next/next/no-img-element */
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setActiveTab, setCreateModal, setDisableBtn, setFetching, setIsOverviewTabDisabled, setOverViewFormData } from '@/store/Slices/leadSlice/manageLeadSlice';
import { useFormik } from 'formik';
import { leadSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { SelectOptionsType, BranchListSecondaryEndpoint, SourceDataType, ContactListSecondaryEndpoint, LeadPrioritySecondaryEndpoint, LeadStatusSecondaryEndpoint, OverviewFormType } from '@/utils/Types';
import { genderList } from '@/utils/Raw Data';

const CreateOverviewForm = () => {
    const dispatch = useDispatch();
    const { isFetching, createModal, isBtnDisabled, leadPriorityList, leadBranchList, leadContactsList, leadSourceList, leadProductList, leadStatusList, overViewFormData } = useSelector(
        (state: IRootState) => state.lead
    );
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);

    const initialValues = {
        priority: {
            value: '',
            label: '',
        },
        status: {
            value: '',
            label: '',
        },
        estimatedDate: '',
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
        subProduct: {
            value: '',
            label: '',
        },
        followUpDate: '',
        gender: {
            value: '',
            label: '',
        },
        zip: '',
    };
    const { values, handleChange, submitForm, handleSubmit, setFieldValue, handleBlur, resetForm, errors } = useFormik({
        initialValues,
        validationSchema: leadSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            // dispatch(setFetching(true));
            try {
                // dispatch(setDisableBtn(true));
                const createLeadObj = {
                    estimatedDate: new Date(value.estimatedDate).toISOString(),
                    followUpDate: new Date(value.followUpDate).toISOString(),
                    sourceId: values.source.value,
                    priorityId: values.priority.value,
                    // statusId: values.status.value,
                    branchId: value.branch.value,
                    contactId: values.contact.value,
                    productId: values.product.value,
                    zip: values.zip.toString(),
                    subProductId: values.subProduct.value,
                    gender: values.gender.value,
                };
                console.log(createLeadObj);

                dispatch(setOverViewFormData(createLeadObj));
                dispatch(setIsOverviewTabDisabled(true));
                dispatch(setActiveTab(1));
                // await new ApiClient().post('lead', createLeadObj);
                // dispatch(setCreateModal(false));
                // action.resetForm();
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
                <span className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: item?.color, backgroundColor: item?.color + '20' }}>
                    {item?.name}
                </span>
            ),
        };
    });

    // const leadStatusDropdown: SelectOptionsType[] = leadStatusList?.map((item: LeadStatusSecondaryEndpoint) => {
    //     return {
    //         value: item.id,
    //         label: (
    //             <div className={`rounded px-2.5 py-0.5 text-center text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: item?.color, backgroundColor: item?.color + '20' }}>
    //                 {item?.name}
    //             </div>
    //         ),
    //     };
    // });

    const leadBranchDropdown: SelectOptionsType[] = leadBranchList?.map((item: BranchListSecondaryEndpoint) => {
        return { value: item.id, label: item.name };
    });

    const leadContactDropdown: SelectOptionsType[] = leadContactsList?.map((item: ContactListSecondaryEndpoint) => {
        return { value: item.id, label: `${item.name} (${item?.email})` };
    });

    const leadSourceDropdown: SelectOptionsType[] = leadSourceList?.map((item: SourceDataType) => {
        return { value: item.id, label: item.name };
    });

    useEffect(() => {
        const createProductDropdown: SelectOptionsType[] = leadProductList?.map((item) => {
            return { label: item?.name, value: item?.id };
        });
        setProductDropdown(createProductDropdown);
    }, [leadProductList]);
    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <label htmlFor="contact">Contact</label>
                    <Select placeholder="Select Contact" options={leadContactDropdown} id="contact" onChange={(e) => setFieldValue('contact', e)} />
                </div>
                <div className="flex-1">
                    <label htmlFor="leadPriority">Lead Priority</label>
                    <Select placeholder="Select lead priority" options={leadPriorityDropdown} id="leadPriority" onChange={(e) => setFieldValue('priority', e)} />
                </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <label htmlFor="leadProduct">Product</label>
                    <Select placeholder="Product" options={productDropdown} id="leadProduct" onChange={(e) => setFieldValue('product', e)} />
                </div>
                <div className="flex-1">
                    <label htmlFor="subProduct">Sub Product</label>
                    <Select placeholder="Sub Product" options={productDropdown} id="subProduct" onChange={(e) => setFieldValue('subProduct', e)} />
                </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <label htmlFor="followUpDate"> Follow Up Date</label>
                    <Flatpickr
                        data-enable-time
                        options={{
                            enableTime: false,
                            dateFormat: 'Y-m-d H:i',
                            position: 'auto',
                        }}
                        id="followUpDate"
                        placeholder="Follow Up Date"
                        name="followUpDate"
                        className="form-input"
                        onChange={(e) => setFieldValue('followUpDate', e)}
                        value={values.followUpDate}
                    />
                </div>
                <div className="flex-1">
                    <label>Estimated Date</label>
                    <Flatpickr
                        data-enable-time
                        options={{
                            enableTime: false,
                            dateFormat: 'Y-m-d H:i',
                            position: 'auto',
                        }}
                        id="estimatedDate"
                        placeholder="Estimated  Date"
                        name="estimatedDate"
                        className="form-input"
                        onChange={(e) => setFieldValue('estimatedDate', e)}
                        value={values.estimatedDate}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <label htmlFor="leadSource"> Source</label>
                    <Select placeholder="Select Source" options={leadSourceDropdown} id="leadSource" onChange={(e) => setFieldValue('source', e)} />
                </div>
                <div className="flex-1">
                    <label htmlFor="gender">Gender</label>
                    <Select placeholder="Select Gender" options={genderList} id="gender" onChange={(e) => setFieldValue('gender', e)} />
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <label htmlFor="branch">Branch</label>
                    <Select placeholder="Select Branch" options={leadBranchDropdown} id="branch" onChange={(e) => setFieldValue('branch', e)} />
                </div>
                <div className="flex-1">
                    <label htmlFor="zip">Zip Code</label>
                    <input onChange={handleChange} onBlur={handleBlur} value={values.zip} id="zip" name="zip" type="number" placeholder="Zip Code" className="form-input" />
                </div>
            </div>
            <div className="mt-8 flex items-center justify-end">
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                        dispatch(setCreateModal(false));
                        dispatch(setIsOverviewTabDisabled(false));
                        dispatch(setActiveTab(0));
                        dispatch(setOverViewFormData({} as OverviewFormType));
                    }}
                    disabled={isBtnDisabled}
                >
                    Discard
                </button>
                <button
                    type="submit"
                    className="btn  btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                    disabled={
                        values.contact.value &&
                        values.estimatedDate &&
                        values.followUpDate &&
                        values.source.value &&
                        values.branch.value &&
                        values.priority.value &&
                        values.product?.value &&
                        values.subProduct.value &&
                        // values.status.value &&
                        values.gender.value &&
                        values.zip &&
                        !isBtnDisabled
                            ? false
                            : true
                    }
                    onClick={() => submitForm()}
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default CreateOverviewForm;

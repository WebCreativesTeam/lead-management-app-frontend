/* eslint-disable @next/next/no-img-element */
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/manageLeadSlice';
import { useFormik } from 'formik';
import { leadSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { SelectOptionsType, BranchListSecondaryEndpoint, SourceDataType, LeadStatusSecondaryEndpoint } from '@/utils/Types';
import { genderList } from '@/utils/Raw Data';

const EditOverviewForm = () => {
    const dispatch = useDispatch();
    const { isBtnDisabled, leadBranchList, leadSourceList, leadProductList, leadStatusList, singleData } = useSelector((state: IRootState) => state.lead);
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [branchDropdown, setBranchDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [sourceDropdown, setSourceDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [defaultSourceValue, setDefaultSourceValue] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultBranch, setDefaultBranch] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultProduct, setDefaultProduct] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultSubProduct, setDefaultSubProduct] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultGender, setDefaultGender] = useState<SelectOptionsType>({} as SelectOptionsType);

    const initialValues = {
        // status: {
        //     value: '',
        //     label: '',
        // },
        estimatedDate: '',
        branch: {
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
    const { values, handleChange, submitForm, handleSubmit, setFieldValue, handleBlur } = useFormik({
        initialValues,
        validationSchema: leadSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const editLeadObj = {
                    branchId: value.branch.value,
                    sourceId: values.source.value,
                    estimatedDate: new Date(value.estimatedDate).toISOString(),
                    productId: values.product.value,
                    gender: values.gender.value,
                    followUpDate: new Date(value.followUpDate).toISOString(),
                    zip: values.zip.toString(),
                    subProductId: values.subProduct.value,
                    // statusId: values.status.value,
                };
                console.log(editLeadObj);
                await new ApiClient().patch('lead/' + singleData?.id, editLeadObj);
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

    useEffect(() => {
        setFieldValue('product', singleData?.productId);
        setFieldValue('subProduct', singleData?.subProductId);
        setFieldValue('followUpDate', singleData?.followUpDate);
        setFieldValue('estimatedDate', singleData?.estimatedDate);
        setFieldValue('source', singleData?.source?.id);
        setFieldValue('gender', singleData?.gender);
        setFieldValue('branch', singleData?.branch?.id);
        setFieldValue('zip', singleData?.zip);

        const findGender: SelectOptionsType | undefined = genderList.find((item: SelectOptionsType) => item?.value === singleData?.gender);
        if (findGender) {
            setDefaultGender(findGender);
        }
    }, [singleData]);

    //create branch dropdown
    useEffect(() => {
        const leadBranchDropdown: SelectOptionsType[] = leadBranchList?.map((item: BranchListSecondaryEndpoint) => {
            return { value: item.id, label: item.name };
        });
        setBranchDropdown(leadBranchDropdown);
    }, [leadBranchList]);

    //find default selected branch
    useEffect(() => {
        const findBranch: SelectOptionsType | undefined = branchDropdown.find((item: SelectOptionsType) => item?.value === singleData?.branch?.id);
        if (findBranch) {
            setDefaultBranch(findBranch);
        }
    }, [branchDropdown, singleData]);

    //create source dropdown
    useEffect(() => {
        const leadSourceDropdown: SelectOptionsType[] = leadSourceList?.map((item: SourceDataType) => {
            return { value: item.id, label: item.name };
        });
        setSourceDropdown(leadSourceDropdown);
    }, [leadSourceList]);

    //find default selected source
    useEffect(() => {
        const findSource: SelectOptionsType | undefined = sourceDropdown.find((item: SelectOptionsType) => item?.value === singleData?.source?.id);
        if (findSource) {
            setDefaultSourceValue(findSource);
        }
    }, [sourceDropdown, singleData]);

    //create product dropdown
    useEffect(() => {
        const createProductDropdown: SelectOptionsType[] = leadProductList?.map((item) => {
            return { label: item?.name, value: item?.id };
        });
        setProductDropdown(createProductDropdown);
    }, [leadProductList]);

    //find default selected product
    useEffect(() => {
        const findProduct: SelectOptionsType | undefined = productDropdown.find((item: SelectOptionsType) => item?.value === singleData?.productId);
        if (findProduct) {
            setDefaultProduct(findProduct);
        }
    }, [productDropdown, singleData]);

    //find default selected subproduct
    useEffect(() => {
        const findSubProduct: SelectOptionsType | undefined = productDropdown.find((item: SelectOptionsType) => item?.value === singleData?.subProductId);
        if (findSubProduct) {
            setDefaultSubProduct(findSubProduct);
        }
    }, [productDropdown, singleData]);

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row">
                {Object.keys(defaultProduct).length > 0 && (
                    <div className="flex-1">
                        <label htmlFor="leadProduct">Product</label>
                        <Select placeholder="Product" options={productDropdown} id="leadProduct" onChange={(e) => setFieldValue('product', e)} defaultValue={defaultProduct} />
                    </div>
                )}
                {Object.keys(defaultSubProduct).length > 0 && (
                    <div className="flex-1">
                        <label htmlFor="subProduct">Sub Product</label>
                        <Select placeholder="Sub Product" options={productDropdown} id="subProduct" onChange={(e) => setFieldValue('subProduct', e)} defaultValue={defaultSubProduct} />
                    </div>
                )}
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
                {Object.keys(defaultSourceValue).length > 0 && (
                    <div className="flex-1">
                        <label htmlFor="leadSource"> Source</label>
                        <Select placeholder="Select Source" options={sourceDropdown} id="leadSource" onChange={(e) => setFieldValue('source', e)} defaultValue={defaultSourceValue} />
                    </div>
                )}

                {Object.keys(defaultGender).length > 0 && (
                    <div className="flex-1">
                        <label htmlFor="gender">Gender</label>
                        <Select placeholder="Select Gender" options={genderList} id="gender" onChange={(e) => setFieldValue('gender', e)} defaultValue={defaultGender} />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                {Object.keys(defaultBranch).length > 0 && (
                    <div className="flex-1">
                        <label htmlFor="branch">Branch</label>
                        <Select placeholder="Select Branch" options={branchDropdown} id="branch" onChange={(e) => setFieldValue('branch', e)} defaultValue={defaultBranch} />
                    </div>
                )}

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
                        dispatch(setEditModal({ open: false }));
                    }}
                    disabled={isBtnDisabled}
                >
                    Discard
                </button>
                <button
                    type="submit"
                    className="btn  btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                    disabled={
                        values.estimatedDate &&
                        values.followUpDate &&
                        (values.source.value || singleData?.source?.id) &&
                        (values.branch.value || singleData?.branch?.id) &&
                        (values.product?.value || singleData?.productId) &&
                        (values.subProduct?.value || singleData.subProductId) &&
                        // values.status.value &&
                        (values.gender?.value || values.gender) &&
                        values.zip &&
                        !isBtnDisabled
                            ? false
                            : true
                    }
                    onClick={() => submitForm()}
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default EditOverviewForm;

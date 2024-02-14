/* eslint-disable @next/next/no-img-element */
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching, getAllSubProductsForLead } from '@/store/Slices/leadSlice/manageLeadSlice';
import { useFormik } from 'formik';
import { leadSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {
    SelectOptionsType,
    BranchListSecondaryEndpoint,
    SourceDataType,
    LeadStatusSecondaryEndpoint,
    GetMethodResponseType,
    ProductSecondaryEndpointType,
    UserListSecondaryEndpointType,
} from '@/utils/Types';
import { genderList } from '@/utils/Raw Data';
import Loader from '@/components/__Shared/Loader';

const EditOverviewForm = () => {
    const dispatch = useDispatch();
    const { isBtnDisabled, leadBranchList, leadSourceList, leadProductList, singleData, isFetching, usersList } = useSelector((state: IRootState) => state.lead);
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [branchDropdown, setBranchDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [sourceDropdown, setSourceDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [defaultSourceValue, setDefaultSourceValue] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultAssignedToValue, setDefaultAssigedToValue] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultBranch, setDefaultBranch] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultProduct, setDefaultProduct] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultSubProduct, setDefaultSubProduct] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultGender, setDefaultGender] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [subProductDropdown, setsubProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [userDropdown, setUserDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const initialValues = {
        estimatedDate: '',
        branch: '',
        source: '',
        product: '',
        subProduct: '',
        followUpDate: '',
        gender: '',
        zip: '',
        assignedToId: '',
    };
    const { values, handleChange, submitForm, handleSubmit, setFieldValue, handleBlur } = useFormik({
        initialValues,
        validationSchema: leadSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            console.log(value);
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const editLeadObj = {
                    branchId: value.branch,
                    sourceId: values.source,
                    estimatedDate: value.estimatedDate ? new Date(value.estimatedDate).toISOString() : null,
                    productId: values.product,
                    gender: values.gender,
                    followUpDate: value.followUpDate ? new Date(value.followUpDate).toISOString() : null,
                    zip: values.zip.toString(),
                    subProductId: value.subProduct,
                    assignedToId: value?.assignedToId ? value?.assignedToId : null,
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
        setFieldValue('product', singleData?.product?.id);
        setFieldValue('subProduct', singleData?.subProduct?.id);
        if (singleData?.followUpDate) {
            setFieldValue('followUpDate', singleData?.followUpDate);
        }
        if (singleData?.estimatedDate) {
            setFieldValue('estimatedDate', singleData?.estimatedDate);
        }
        setFieldValue('source', singleData?.source?.id);
        setFieldValue('gender', singleData?.gender);
        setFieldValue('branch', singleData?.branch?.id);
        setFieldValue('zip', singleData?.zip);
        if (singleData?.assignedTo?.id) {
            setFieldValue('assignedToId', singleData?.assignedTo?.id);
        }

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

    //find default selected assignto
    useEffect(() => {
        const findAssignedToLead: SelectOptionsType | undefined = userDropdown.find((item: SelectOptionsType) => item?.value === singleData?.assignedTo?.id);
        if (findAssignedToLead) {
            setDefaultAssigedToValue(findAssignedToLead);
        }
    }, [userDropdown, singleData]);

    //create product dropdown
    useEffect(() => {
        const createProductDropdown: SelectOptionsType[] = leadProductList?.map((item) => {
            return { label: item?.name, value: item?.id };
        });
        setProductDropdown(createProductDropdown);
    }, [leadProductList]);

    //find default selected product
    useEffect(() => {
        const findProduct: SelectOptionsType | undefined = productDropdown.find((item: SelectOptionsType) => item?.value === singleData?.product?.id);
        if (findProduct) {
            setDefaultProduct(findProduct);
        }
    }, [productDropdown, singleData]);

    //find default selected subproduct
    useEffect(() => {
        const findSubProduct: SelectOptionsType | undefined = subProductDropdown.find((item: SelectOptionsType) => item?.value === singleData?.subProduct?.id);
        if (findSubProduct) {
            setDefaultSubProduct(findSubProduct);
        }
    }, [subProductDropdown, singleData]);

    // fetch all sub product list
    const getAllSubProducts = async (id: string) => {
        if (id) {
            setIsLoading(true);
            const productSubList: GetMethodResponseType = await new ApiClient().get('product/list/' + id);
            const subProducts: ProductSecondaryEndpointType[] = productSubList?.data;
            if (typeof subProducts === 'undefined') {
                dispatch(getAllSubProductsForLead([] as ProductSecondaryEndpointType[]));
                setIsLoading(false);
                return;
            }
            const createSubProductDropdown: SelectOptionsType[] = subProducts?.map((item) => {
                return { label: item?.name, value: item?.id };
            });
            setsubProductDropdown(createSubProductDropdown);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const createProductDropdown: SelectOptionsType[] = leadProductList?.map((item) => {
            return { label: item?.name, value: item?.id };
        });
        setProductDropdown(createProductDropdown);
        getAllSubProducts(values?.product || singleData?.product?.id);
    }, [values.product, singleData]);

    useEffect(() => {
        const userDropdownList: SelectOptionsType[] = usersList?.map((item: UserListSecondaryEndpointType) => {
            return { value: item?.id, label: `${item.firstName} ${item.lastName} (${item?.email})` };
        });
        const uid: string | null = localStorage?.getItem('uid');
        if (uid) {
            const filteredArray = userDropdownList?.filter((state) => state.value !== uid);
            filteredArray.unshift({ label: 'Self', value: uid });
            setUserDropdown(filteredArray);
        }
    }, [usersList]);

    return isFetching ? (
        <Loader />
    ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row">
                {/* {Object.keys(defaultProduct).length > 0 && ( */}
                <div className="flex-1">
                    <label htmlFor="leadProduct">Product</label>
                    <Select placeholder="Product" options={productDropdown} id="leadProduct" onChange={(data) => setFieldValue('product', data?.value)} defaultValue={defaultProduct} />
                </div>
                {/* )} */}
                {/* {Object.keys(defaultSubProduct).length > 0 && ( */}
                <div className="flex-1">
                    <label htmlFor="subProduct">Sub Product</label>
                    <Select
                        placeholder="Sub Product"
                        options={subProductDropdown}
                        id="subProduct"
                        onChange={(data) => setFieldValue('subProduct', data?.value)}
                        defaultValue={defaultSubProduct}
                        isDisabled={values?.product || singleData?.product?.id || !isLoading ? false : true}
                        // isLoading || Object.keys(defaultProduct).length === 0}
                    />
                </div>
                {/* )} */}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <label> Follow Up Date (optional)</label>
                    <Flatpickr
                        data-enable-time
                        options={{
                            enableTime: true,
                            dateFormat: 'Y-m-d H:i',
                            position: 'auto',
                        }}
                        placeholder="Follow Up Date"
                        name="followUpDate"
                        className="form-input"
                        onChange={(e) => setFieldValue('followUpDate', e)}
                        value={values.followUpDate}
                    />
                </div>
                <div className="flex-1">
                    <label>Estimated Purchase Date (optional)</label>
                    <Flatpickr
                        data-enable-time
                        options={{
                            enableTime: false,
                            dateFormat: 'Y-m-d',
                            position: 'auto',
                        }}
                        placeholder="Estimated Purchase Date"
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
                        <label htmlFor="leadSource">Source</label>
                        <Select placeholder="Select Source" options={sourceDropdown} id="leadSource" onChange={(data) => setFieldValue('source', data?.value)} defaultValue={defaultSourceValue} />
                    </div>
                )}

                {Object.keys(defaultGender).length > 0 && (
                    <div className="flex-1">
                        <label htmlFor="gender">Gender</label>
                        <Select placeholder="Select Gender" options={genderList} id="gender" onChange={(data) => setFieldValue('gender', data?.value)} defaultValue={defaultGender} />
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
                    <label htmlFor="zip">Pin Code</label>
                    <input onChange={handleChange} onBlur={handleBlur} value={values.zip} id="zip" name="zip" type="number" placeholder="Pin Code" className="form-input" />
                </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <label htmlFor="leadAssignTo">Assign To (optional)</label>
                    <Select
                        placeholder="Select Lead Assign To"
                        options={userDropdown}
                        id="leadAssignTo"
                        onChange={(e) => setFieldValue('assignedToId', e?.value)}
                        defaultValue={defaultAssignedToValue}
                    />
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
                        (values.source || singleData?.source?.id) &&
                        (values.branch || singleData?.branch?.id) &&
                        (values.product || singleData?.product?.id) &&
                        (values.subProduct || singleData.subProduct?.id) &&
                        (values.gender || singleData.gender) &&
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

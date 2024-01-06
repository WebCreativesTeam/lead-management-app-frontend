import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { getAllProductsForLeadAssignment, setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadAssigningSlice';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import { leadAssignmentSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import Select from 'react-select';
import { ProductSecondaryEndpointType, SourceDataType, UserListSecondaryEndpointType } from '@/utils/Types';

type SelectOptionsType = {
    value: string;
    label: string;
};

const LeadAssignmentCreateModal = () => {
    const { createModal, isBtnDisabled, isFetching, sourceList, usersList, productList } = useSelector((state: IRootState) => state.leadAssignment);
    const [sourceDropdown, setSourceDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [userDropdown, setUserDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);

    useEffect(() => {
        const sourceOptions: SelectOptionsType[] = sourceList?.map((item: SourceDataType) => {
            return { value: item.id, label: item.name };
        });
        sourceOptions.unshift({
            label: 'All',
            value: 'All',
        });
        setSourceDropdown(sourceOptions);
    }, [sourceList]);

    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            name: '',
            productId: '',
            sourceId: '',
            isAllSource: true,
            isAllProduct: true,
            userPercentages: [
                {
                    userId: '',
                    percentage: '',
                },
            ],
        },
        validationSchema: leadAssignmentSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            const createLeadAssigningObj: any = {
                name: value.name,
                userPercentages: value.userPercentages,
            };
            if (value.isAllSource && value.isAllProduct) {
                createLeadAssigningObj.isAllSource = true;
                createLeadAssigningObj.isAllProduct = true;
            } else if (!value.isAllSource && value.isAllProduct) {
                createLeadAssigningObj.isAllProduct = true;
                createLeadAssigningObj.sourceId = value.sourceId;
            } else if (value.isAllSource && !value.isAllProduct) {
                createLeadAssigningObj.isAllSource = true;
                createLeadAssigningObj.productId = value.productId;
            } else if (!value.isAllSource && !value.isAllProduct) {
                createLeadAssigningObj.isAllSource = false;
                createLeadAssigningObj.isAllProduct = false;
                createLeadAssigningObj.productId = value.productId;
                createLeadAssigningObj.sourceId = value.sourceId;
            }
            console.log(createLeadAssigningObj);
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().post('lead-assignment', createLeadAssigningObj);
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

    useEffect(() => {
        const userListDropdown: SelectOptionsType[] = usersList?.map((item: UserListSecondaryEndpointType) => {
            return { value: item.id, label: `${item.firstName} ${item.lastName} (${item?.email})` };
        });
        const createIdArrayOfUsers: string[] = formik.values.userPercentages.map((item) => {
            return item.userId;
        });
        const filterBySelectedUser = userListDropdown.filter((item) => {
            return !createIdArrayOfUsers.includes(item?.value);
        });
        setUserDropdown(filterBySelectedUser);
    }, [usersList, formik.values.userPercentages]);

    useEffect(() => {
        const productDropdown: SelectOptionsType[] = productList?.map((item: ProductSecondaryEndpointType) => {
            return { value: item.id, label: item?.name };
        });
        productDropdown.unshift({
            label: 'All',
            value: 'All',
        });
        setProductDropdown(productDropdown);
    }, [productList]);

    return (
        <Modal
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={() => {
                dispatch(setCreateModal(false));
                formik.resetForm();
            }}
            size="large"
            onSubmit={() => formik.submitForm()}
            title="Create Lead Assignment"
            isBtnDisabled={
                formik.values.name &&
                (formik.values.productId || formik.values.isAllProduct) &&
                (formik.values.sourceId || formik.values.isAllSource) &&
                formik.values.userPercentages[formik.values.userPercentages.length - 1].userId &&
                formik.values.userPercentages[formik.values.userPercentages.length - 1].percentage &&
                !isBtnDisabled
                    ? false
                    : true
            }
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <FormikProvider value={formik}>
                        <form className="space-y-5" onSubmit={formik.handleSubmit}>
                            <div>
                                <label htmlFor="createLeadAssignment">Lead Assignment Name</label>
                                <input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    id="createLeadAssignment"
                                    name="name"
                                    type="text"
                                    placeholder="Lead Assignment Name"
                                    className="form-input"
                                />
                            </div>
                            <div className="flex flex-col gap-5 sm:flex-row">
                                <div className="flex-1">
                                    <label htmlFor="state">Source</label>
                                    <Select
                                        placeholder="Select Source"
                                        options={sourceDropdown}
                                        onChange={(data: any) => {
                                            if (data.value === 'All') {
                                                formik.setFieldValue('isAllSource', true);
                                            } else {
                                                formik.setFieldValue('sourceId', data.value);
                                                formik.setFieldValue('isAllSource', false);
                                            }
                                        }}
                                        defaultValue={{ label: 'All', value: 'All' }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="state">Product</label>
                                    <Select
                                        placeholder="Select Product"
                                        options={productDropdown}
                                        onChange={(data: any) => {
                                            if (data.value === 'All') {
                                                formik.setFieldValue('isAllProduct', true);
                                            } else {
                                                formik.setFieldValue('productId', data.value);
                                                formik.setFieldValue('isAllProduct', false);
                                            }
                                        }}
                                        defaultValue={{ label: 'All', value: 'All' }}
                                    />
                                </div>
                            </div>
                            <FieldArray
                                name="userPercentages"
                                render={(arrayHelpers) => (
                                    <div className="my-6">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary rounded"
                                                onClick={() => arrayHelpers.push({ userId: '', percentage: '' })}
                                                disabled={
                                                    formik.values.userPercentages[formik.values.userPercentages.length - 1].userId &&
                                                    formik.values.userPercentages[formik.values.userPercentages.length - 1].percentage
                                                        ? false
                                                        : true
                                                }
                                            >
                                                Add Lead Rule
                                            </button>
                                        </div>
                                        {formik.values.userPercentages.map((userPercentages, index) => (
                                            <div key={index} className="my-2 flex flex-1 flex-col gap-4 sm:flex-row">
                                                <div className="flex-1">
                                                    <label htmlFor="platform">User</label>
                                                    <Select
                                                        placeholder="Select User"
                                                        options={userDropdown}
                                                        onChange={(data: any) => formik.setFieldValue(`userPercentages[${index}].userId`, data.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label>Percentage</label>
                                                    <input
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.userPercentages[index].percentage}
                                                        name={`userPercentages[${index}].percentage`}
                                                        type="text"
                                                        placeholder="Enter Percentage"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => arrayHelpers.remove(index)}
                                                        disabled={formik.values.userPercentages.length < 2}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                        </form>
                    </FormikProvider>
                )
            }
        />
    );
};

export default memo(LeadAssignmentCreateModal);

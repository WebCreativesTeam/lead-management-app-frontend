import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { getAllProductsForLeadAssignment, setEditModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadAssigningSlice';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import { leadAssignmentSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import Select from 'react-select';
import { GetMethodResponseType, ProductSecondaryEndpointType, SelectOptionsType, SourceDataType, UserListSecondaryEndpointType } from '@/utils/Types';

const LeadAssignmentEditModal = () => {
    const { editModal, isBtnDisabled, isFetching, sourceList, singleData, usersList } = useSelector((state: IRootState) => state.leadAssignment);
    const [sourceDropdown, setSourceDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [loading, setLoading] = useState<boolean>(false);
    const [userDropdown, setUserDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [defaultProduct, setDefaultProduct] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultSource, setDefaultSource] = useState<SelectOptionsType>({} as SelectOptionsType);

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

    useEffect(() => {
        formik.setFieldValue('name', singleData?.name);

        if (singleData.isAllSource) {
            formik.setFieldValue('isAllSource', singleData?.isAllSource);
        } else {
            formik.setFieldValue('sourceId', singleData?.source?.id);
        }
        if (singleData.isAllProduct) {
            formik.setFieldValue('isAllProduct', singleData?.isAllProduct);
        } else {
            formik.setFieldValue('productId', singleData?.product?.id);
        }
        formik.setFieldValue('userPercentages', singleData?.userPercentages);
    }, [singleData]);

    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            name: '',
            productId: '',
            sourceId: '',
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
            if (value.productId === 'All' && value.sourceId === 'All') {
                createLeadAssigningObj.isAllSource = true;
                createLeadAssigningObj.isAllProduct = true;
            } else if (value.productId === 'All' && value.sourceId !== 'All') {
                createLeadAssigningObj.isAllProduct = true;
                createLeadAssigningObj.sourceId = value.sourceId;
            } else if (value.productId !== 'All' && value.sourceId === 'All') {
                createLeadAssigningObj.isAllSource = true;
                createLeadAssigningObj.productId = value.productId;
            }
            console.log(createLeadAssigningObj);
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('lead-assignment/' + singleData?.id, createLeadAssigningObj);
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
        getAllProducts();
    }, [])
    console.log(singleData)

    //find default selected product
    useEffect(() => {
        const findProduct: SelectOptionsType | undefined = productDropdown.find((item: SelectOptionsType) => item?.value === singleData?.product?.id);
        if (findProduct) {
            setDefaultProduct(findProduct);
        } else {
            setDefaultProduct({ label: 'All', value: 'All' });
        }
    }, [productDropdown, singleData]);

    //find default selected source
    useEffect(() => {
        const findSource: SelectOptionsType | undefined = sourceDropdown.find((item: SelectOptionsType) => item?.value === singleData?.source?.id);
        if (findSource) {
            setDefaultSource(findSource);
        } else {
            setDefaultSource({ label: 'All', value: 'All' });
        }
    }, [sourceDropdown, singleData]);

    //get products list
    const getAllProducts = async () => {
        setLoading(true);
        const productsList: GetMethodResponseType = await new ApiClient().get('product/list');
        const products: ProductSecondaryEndpointType[] = productsList?.data;
        if (typeof products === 'undefined') {
            dispatch(getAllProductsForLeadAssignment([] as ProductSecondaryEndpointType[]));
            setLoading(false);
            return;
        }
        const productDropdown: SelectOptionsType[] = products?.map((item: ProductSecondaryEndpointType) => {
            return { value: item.id, label: item?.name };
        });
        productDropdown.unshift({
            label: 'All',
            value: 'All',
        });
        setProductDropdown(productDropdown);
        dispatch(getAllProductsForLeadAssignment(products));
        setLoading(false);
    };

    const changeUserDropdowon = () => {
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
    };

    useEffect(() => {
        const userListDropdown: SelectOptionsType[] = usersList?.map((item: UserListSecondaryEndpointType) => {
            return { value: item.id, label: `${item.firstName} ${item.lastName} (${item?.email})` };
        });
        setUserDropdown(userListDropdown);
    }, [usersList]);

    return (
        <Modal
            open={editModal}
            onClose={() => {
                dispatch(setEditModal({ open: false }));
            }}
            onDiscard={() => {
                dispatch(setEditModal({ open: false }));
                formik.resetForm();
            }}
            size="large"
            onSubmit={() => formik.submitForm()}
            title="Edit Lead Assignment"
            isBtnDisabled={
                formik.values.name &&
                formik.values.productId &&
                formik.values.sourceId &&
                formik.values.userPercentages[formik.values.userPercentages.length - 1].userId &&
                formik.values.userPercentages[formik.values.userPercentages.length - 1].percentage &&
                !isBtnDisabled
                    ? false
                    : true
            }
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching || loading ? (
                    <Loader />
                ) : (
                    <FormikProvider value={formik}>
                        <form className="space-y-5" onSubmit={formik.handleSubmit}>
                            <div>
                                <label htmlFor="editLeadAssignment">Lead Assignment Name</label>
                                <input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    id="editLeadAssignment"
                                    name="name"
                                    type="text"
                                    placeholder="Lead Assignment Name"
                                    className="form-input"
                                />
                            </div>
                            <div className="flex flex-col gap-5 sm:flex-row">
                                <div className="flex-1">
                                    <label htmlFor="state">Source</label>
                                    <Select placeholder="Select Source" options={sourceDropdown} onChange={(data: any) => formik.setFieldValue('sourceId', data.value)} defaultValue={defaultSource} />
                                </div>
                                {Object.keys(defaultProduct).length > 0 && (
                                    <div className="flex-1">
                                        <label htmlFor="state">Product</label>
                                        <Select
                                            placeholder="Select Product"
                                            options={productDropdown}
                                            onChange={(data: any) => formik.setFieldValue('productId', data.value)}
                                            defaultValue={defaultProduct}
                                        />
                                    </div>
                                )}
                            </div>
                            <FieldArray
                                name="userPercentages"
                                render={(arrayHelpers) => (
                                    <div className="my-6">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary rounded"
                                                onClick={() => arrayHelpers.push({ platform: '', templateId: '' })}
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
                                                        onChange={(data: any) => {
                                                            formik.setFieldValue(`userPercentages[${index}].userId`, data.value);
                                                            changeUserDropdowon();
                                                        }}
                                                        defaultValue={userDropdown?.find((item: SelectOptionsType) => item?.value === singleData?.userPercentages[index]?.userId)}
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
                                                        onClick={() => {
                                                            arrayHelpers.remove(index);
                                                            changeUserDropdowon();
                                                        }}
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

export default memo(LeadAssignmentEditModal);

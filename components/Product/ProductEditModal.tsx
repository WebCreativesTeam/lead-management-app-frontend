/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/productSlice';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { productSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../__Shared/Loader';
import { ProductColorSecondaryEndpointType } from '@/utils/Types';
import Select from 'react-select';

type SelectOptionsType = {
    value: string;
    label: string;
};

const ProductEditModal = () => {
    const { editModal, singleData, isBtnDisabled, isFetching, colors } = useSelector((state: IRootState) => state.product);

    const dispatch = useDispatch();
    const [colorDropdown, setColorDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [defaultColorValue, setDefaultColorValue] = useState<
        {
            label: string;
            value: string;
        }[][]
    >([[{ label: '', value: '' }]]);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            updateInstances: [
                {
                    name: '',
                    colorIds: [] as string[],
                    id: '',
                },
            ],
        },
        validationSchema: productSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                // if (singleData?.name === value.name && singleData?.description === value.description) {
                //     await new ApiClient().patch('sub-product/' + singleData?.id, value.updateInstances);
                // } else {
                await new ApiClient().patch('product/' + singleData?.id, { name: value.name, description: value.description });
                // }

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
        formik.setFieldValue('name', singleData?.name);
        formik.setFieldValue('description', singleData?.description);

        const findDefaultSelectedColors = singleData?.subProducts?.map((item) => {
            return item?.colors?.map((item) => {
                return { label: item?.name, value: item?.id };
            });
        });
        setDefaultColorValue(findDefaultSelectedColors);

        const defaultInstances = singleData?.subProducts?.map((item) => {
            return { name: item?.name, colorIds: item?.colors?.map((item) => item?.id) };
        });

        formik.setFieldValue('updateInstances', defaultInstances);
    }, [singleData]);

    useEffect(() => {
        const createColorDropdown: SelectOptionsType[] = colors?.map((item: ProductColorSecondaryEndpointType) => {
            return { value: item?.id, label: item?.name };
        });
        setColorDropdown(createColorDropdown);
    }, [colors]);

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
            title="edit Product"
            isBtnDisabled={
                formik.values.name &&
                formik.values.description &&
                formik.values.updateInstances[formik.values.updateInstances.length - 1]?.name &&
                formik.values.updateInstances[formik.values.updateInstances.length - 1]?.colorIds?.length > 0 &&
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
                                <label htmlFor="editProductName">Product Name</label>
                                <input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    id="editProductName"
                                    name="name"
                                    type="text"
                                    placeholder="Product Name"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="editProductDescription">Product Description</label>
                                <textarea
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description}
                                    id="editProductDescription"
                                    name="description"
                                    placeholder="Product Description"
                                    className="form-input"
                                    rows={5}
                                ></textarea>
                            </div>
                            <div>
                                <FieldArray
                                    name="instances"
                                    render={(arrayHelpers) => (
                                        <div className="my-6">
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary rounded"
                                                    onClick={() => arrayHelpers.push({ name: '', colorIds: [] })}
                                                    disabled={
                                                        !formik.values.updateInstances[formik.values.updateInstances.length - 1].name ||
                                                        formik.values.updateInstances[formik.values.updateInstances?.length - 1].colorIds?.length < 1
                                                    }
                                                >
                                                    Add Sub Product
                                                </button>
                                            </div>
                                            {formik.values.updateInstances.map((updateInstances, index) => (
                                                <div key={index} className="panel my-6 flex flex-1 flex-col gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <label htmlFor={`textForOption${index + 1}`}>Name</label>
                                                        <input
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.updateInstances[index].name}
                                                            id={`textForOption${index + 1}`}
                                                            name={`updateInstances[${index}].name`}
                                                            type="text"
                                                            placeholder={'Name'}
                                                            className="form-input"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="productColor">Color</label>
                                                        <Select
                                                            placeholder="Select Color"
                                                            options={colorDropdown}
                                                            onChange={(data: any) => {
                                                                formik.setFieldValue(
                                                                    `updateInstances[${index}].colorIds`,
                                                                    data?.map((item: SelectOptionsType) => item?.value)
                                                                );
                                                            }}
                                                            isMulti
                                                            defaultValue={defaultColorValue[index]}
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => arrayHelpers.remove(index)}
                                                            disabled={formik.values.updateInstances.length <= 1}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                            </div>
                        </form>
                    </FormikProvider>
                )
            }
        />
    );
};

export default memo(ProductEditModal);

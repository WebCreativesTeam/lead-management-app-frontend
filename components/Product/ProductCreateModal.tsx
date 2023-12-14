import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/productSlice';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { productSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../__Shared/Loader';
import Select from 'react-select';
import { ProductColorSecondaryEndpointType, SelectOptionsType } from '@/utils/Types';

const CreateProductModal = () => {
    const { createModal, isBtnDisabled, isFetching, colors } = useSelector((state: IRootState) => state.product);
    const [colorDropdown, setColorDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);

    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            instances: [
                {
                    name: '',
                    colorIds: [],
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
                console.log(value);
                await new ApiClient().post('product', value);
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
        const createColorDropdown: SelectOptionsType[] = colors?.map((item: ProductColorSecondaryEndpointType) => {
            return { value: item?.id, label: item?.name };
        });
        setColorDropdown(createColorDropdown);
    }, [colors]);

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
            title="Create Product"
            isBtnDisabled={
                formik.values.name &&
                formik.values.description &&
                formik.values.instances[formik.values.instances.length - 1].name &&
                formik.values.instances[formik.values.instances.length - 1].colorIds.length > 0 &&
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
                                <label htmlFor="createProductName">Product Name</label>
                                <input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    id="createProductName"
                                    name="name"
                                    type="text"
                                    placeholder="Product Name"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="createProductDescription">Product Description</label>
                                <textarea
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description}
                                    id="createProductDescription"
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
                                                        !formik.values.instances[formik.values.instances.length - 1].name ||
                                                        formik.values.instances[formik.values.instances.length - 1].colorIds.length < 1
                                                    }
                                                >
                                                    Add instances
                                                </button>
                                            </div>
                                            {formik.values.instances.map((instances, index) => (
                                                <div key={index} className="panel my-6 flex flex-1 flex-col gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <label htmlFor={`textForOption${index + 1}`}>Name</label>
                                                        <input
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.instances[index].name}
                                                            id={`textForOption${index + 1}`}
                                                            name={`instances[${index}].name`}
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
                                                                    `instances[${index}].colorIds`,
                                                                    data?.map((item: SelectOptionsType) => item?.value)
                                                                );
                                                            }}
                                                            isMulti
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => arrayHelpers.remove(index)}>
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

export default memo(CreateProductModal);

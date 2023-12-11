/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/productSlice';
import { useFormik } from 'formik';
import { productSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../__Shared/Loader';

const ProductEditModal = () => {
    const { editModal, singleData, isBtnDisabled, isFetching } = useSelector((state: IRootState) => state.product);

    const dispatch = useDispatch();
    useEffect(() => {
        setFieldValue('name', singleData?.name);
    }, [singleData]);

    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: productSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('product/' + singleData.id, { name: value.name });

                action.resetForm();
                dispatch(setEditModal({ open: false }));
            } catch (error: any) {
                if (typeof error?.response?.data?.message === 'object') {
                    showToastAlert(error?.response?.data?.message.join(' , '));
                } else if (error?.response?.data?.message) {
                    showToastAlert(error?.response?.data?.message);
                } else if (error?.response?.data) {
                    showToastAlert(error?.response?.data);
                }
                showToastAlert(error?.response?.data?.message);
            }
            dispatch(setDisableBtn(false));
            dispatch(setFetching(false));
        },
    });
    const handleDiscard = () => {
        dispatch(setEditModal({ open: false }));
        resetForm();
    };
    return (
        <Modal
            open={editModal}
            onClose={() => dispatch(setEditModal({ open: false }))}
            size="medium"
            onDiscard={handleDiscard}
            title="Edit Product"
            onSubmit={() => submitForm()}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="editProduct">Product Name</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="editProduct" name="name" type="text" placeholder="Product Name" className="form-input" />
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(ProductEditModal);

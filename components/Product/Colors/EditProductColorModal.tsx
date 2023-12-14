/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setDisableBtn, setEditModal, setFetching } from '@/store/Slices/productColorSlice';
import { useFormik } from 'formik';
import { productColorSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';

const EditProductColorModal = () => {
    const { isBtnDisabled, editModal, isFetching, singleData } = useSelector((state: IRootState) => state.productColor);
    const [inputColor, setInputColor] = useState<string>('');

    const dispatch = useDispatch();

    const { values, handleChange, submitForm, handleSubmit, handleBlur, resetForm, setFieldValue } = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: productColorSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const editProductColorObj = {
                    name: value.name,
                    value: inputColor,
                };
                await new ApiClient().patch('color/' + singleData?.id, editProductColorObj);
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
    const handleDiscard = () => {
        dispatch(setEditModal({ open: false }));
        resetForm();
    };
    useEffect(() => {
        setFieldValue('name', singleData?.name);
    }, [singleData]);
    return (
        <Modal
            open={editModal}
            onClose={() => {
                dispatch(setEditModal({ open: false }));
            }}
            onDiscard={handleDiscard}
            size="medium"
            onSubmit={() => submitForm()}
            title="Edit Color"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="editProductColor">Color Name</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="editProductColor" name="name" type="text" placeholder="Color Name" className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="statusColor">Select Color</label>
                            <input onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setInputColor(e.target.value)} id="statusColor" name="color" type="color" defaultValue={singleData.value} />
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(EditProductColorModal);

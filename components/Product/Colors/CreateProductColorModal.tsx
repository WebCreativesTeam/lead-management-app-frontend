import React, { memo, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/productColorSlice';
import { useFormik } from 'formik';
import { productColorSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';

const CreateProductColorModal = () => {
    const { isBtnDisabled, createModal, isFetching } = useSelector((state: IRootState) => state.productColor);
    const [inputColor, setInputColor] = useState<string>('');

    const dispatch = useDispatch();
    const initialValues = {
        name: '',
    };
    const { values, handleChange, submitForm, handleSubmit, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: productColorSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const createProductColorObj = {
                    name: value.name,
                    value: inputColor,
                };
                await new ApiClient().post('color', createProductColorObj);
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
    const handleDiscard = () => {
        dispatch(setCreateModal(false));
        resetForm();
    };
    return (
        <Modal
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={handleDiscard}
            size="medium"
            onSubmit={() => submitForm()}
            title="Create Color"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="createProductColor">Color Name</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                id="createProductColor"
                                name="name"
                                type="text"
                                placeholder="Color Name"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="statusColor">Select Color</label>
                            <input onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setInputColor(e.target.value)} id="statusColor" name="color" type="color" />
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(CreateProductColorModal);

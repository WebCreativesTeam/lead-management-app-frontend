/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/userSlice';
import { useFormik } from 'formik';
import { editUserSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { UserDataType } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';

const UserEditModal = () => {
    const {editModal,isBtnDisabled,singleData} = useSelector((state: IRootState) => state.user);

    const dispatch = useDispatch();
    useEffect(() => {
        setFieldValue('firstName', singleData?.firstName);
        setFieldValue('lastName', singleData?.lastName);
    }, [singleData]);

    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
        },
        validationSchema: editUserSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('users/' + singleData.id, value);
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
            title="Edit User"
            onSubmit={() => submitForm()}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={values.firstName && values.lastName && !isBtnDisabled ? false : true}
            content={
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstNameEdit">First Name</label>
                        <input onChange={handleChange} onBlur={handleBlur} value={values.firstName} id="firstNameEdit" name="firstName" type="text" placeholder="First Name" className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="lastNameEdit">Last Name</label>
                        <input onChange={handleChange} onBlur={handleBlur} value={values.lastName} id="lastNameEdit" name="lastName" type="text" placeholder="Last Name" className="form-input" />
                    </div>
                </form>
            }
        />
    );
};

export default memo(UserEditModal);

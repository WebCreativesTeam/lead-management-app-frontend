import React, { memo } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/userSlice';
import { useFormik } from 'formik';
import { createUserSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import { omit } from 'lodash';

const UserCreateModal = () => {
    const { createModal, isBtnDisabled, isFetching } = useSelector((state: IRootState) => state.user);
    const dispatch = useDispatch();

    const { values, handleChange, submitForm, handleSubmit, errors, handleBlur, resetForm } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirm: '',
        },
        validationSchema: createUserSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            const { firstName, email, lastName, password } = value;
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().post('user', { firstName, email, lastName, password });
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

    const showAlert = async () => {
        if (errors.firstName) {
            showToastAlert(errors.firstName);
        } else if (errors.lastName) {
            showToastAlert(errors.lastName);
        } else if (errors.email) {
            showToastAlert(errors.email);
        } else if (errors.password) {
            showToastAlert(errors.password);
        } else if (errors.passwordConfirm) {
            showToastAlert(errors.passwordConfirm);
        }
    };
    return (
        <Modal
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={handleDiscard}
            size="large"
            onSubmit={() => {
                errors && showAlert();
                submitForm();
            }}
            title="Create User"
            isBtnDisabled={values.firstName && values.lastName && values.email && values.password && values.passwordConfirm && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <div className="flex min-h-[10rem] items-center">
                        <span className="m-auto inline-block h-14 w-14 animate-[spin_3s_linear_infinite] rounded-full border-8 border-b-success border-l-primary border-r-warning border-t-danger align-middle"></span>
                    </div>
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstName}
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    className="form-input"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="lastName">Last Name</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.lastName} id="lastName" name="lastName" type="text" placeholder="Last Name" className="form-input" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.email} id="email" name="email" type="email" placeholder="Email" className="form-input" />
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="password">Password</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="form-input"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="confirmPassword">Confirm password</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.passwordConfirm}
                                    id="confirmPassword"
                                    name="passwordConfirm"
                                    type="password"
                                    placeholder="confirmPassword"
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(UserCreateModal);

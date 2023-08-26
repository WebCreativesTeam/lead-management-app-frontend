/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching, setPermissionKeyArr } from '@/store/Slices/policySlice';
import { useFormik } from 'formik';
import { policySchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { Permission, PolicyDataType } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';
import Swal from 'sweetalert2';
import Loader from '../__Shared/Loader';

const PolicyEditModal = () => {
    const { isFetching, isBtnDisabled, permissions, permissionKeyArr, editModal, singleData } = useSelector((state: IRootState) => state.policy);
    const dispatch = useDispatch();
    useEffect(() => {
        setFieldValue('name', singleData?.name);
        setFieldValue('description', singleData?.description);
    }, [singleData]);

    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema: policySchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('policies/' + singleData?.id, { ...value, permissions: permissionKeyArr });
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
    const showAlert = async () => {
        if (errors.name) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.name,
                padding: '10px 20px',
            });
        } else if (errors.description) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.description,
                padding: '10px 20px',
            });
        }
    };
    return (
        <Modal
            open={editModal}
            onClose={() => dispatch(setEditModal({ open: false }))}
            size="xLarge"
            onDiscard={handleDiscard}
            title="Edit Policy"
            onSubmit={() => {
                errors && showAlert();
                submitForm();
            }}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={values.name && values.description && permissionKeyArr.length !== 0 && !isBtnDisabled ? false : true}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col sm:flex-row sm:gap-8">
                            <div className="flex-1">
                                <label htmlFor="policyNameEdit">Policy Name</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="policyNameEdit" name="name" type="text" placeholder="Policy Name" className="form-input" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="policyDescriptionEdit">Policy Description</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    id="policyDescriptionEdit"
                                    name="description"
                                    type="text"
                                    placeholder="Policy Description"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <p className="text-lg font-bold">Permissions</p>
                        <div className="grid gap-y-1 sm:grid-cols-2 sm:gap-y-4 md:grid-cols-3">
                            {permissions.map((item: Permission, i: number) => {
                                return (
                                    <div key={i} className="flex gap-3">
                                        <label className="relative h-6 w-12">
                                            <input
                                                type="checkbox"
                                                className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                                id="custom_switch_checkbox1"
                                                name="permission"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setPermissionKeyArr({ key: item.key, switchValue: e.target.checked }))}
                                                defaultChecked={singleData?.permissions?.includes(item.key) ? true : false}
                                            />
                                            <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                                        </label>
                                        <span>{item.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(PolicyEditModal);

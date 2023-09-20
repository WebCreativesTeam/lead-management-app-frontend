/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadPrioritySlice';
import { useFormik } from 'formik';
import { leadPrioritySchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';

const EditPriorityModal = () => {
    const { isBtnDisabled, editModal, isFetching, singleData } = useSelector((state: IRootState) => state.leadPriority);
    const [inputColor, setInputColor] = useState<string>('');

    useEffect(() => {}, []);

    const dispatch = useDispatch();
    const initialValues = {
        name: '',
    };

    const { values, handleChange, submitForm, setFieldValue, handleSubmit, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: leadPrioritySchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const EditLeadPriorityObj = {
                    name: value.name,
                    color: inputColor,
                };
                await new ApiClient().patch(`lead-priority/${singleData?.id}`, EditLeadPriorityObj);
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
        setInputColor(singleData?.color);
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
            title="Edit Lead Priority"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="editLeadPriority">Lead Priority Name</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                id="editLeadPriority"
                                name="name"
                                type="text"
                                placeholder="Lead Priority Name"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="priorityColor">Lead Priority Color</label>
                            <input onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setInputColor(e.target.value)} id="priorityColor" name="color" type="color" defaultValue={inputColor} />
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(EditPriorityModal);

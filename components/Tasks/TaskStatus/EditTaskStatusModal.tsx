/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setDisableBtn, setEditModal, setFetching } from '@/store/Slices/taskSlice/taskStatusSlice';
import { useFormik } from 'formik';
import { taskStatusSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';

const EditTaskStatusModal = () => {
    const { isBtnDisabled, editModal, isFetching,singleData } = useSelector((state: IRootState) => state.taskStatus);
    const [inputColor, setInputColor] = useState<string>('');

    const dispatch = useDispatch();

    const { values, handleChange, submitForm, handleSubmit, handleBlur, resetForm, setFieldValue } = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: taskStatusSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const editTaskStatusObj = {
                    name: value.name,
                    color: inputColor,
                };
                await new ApiClient().patch('task-status/'+singleData?.id, editTaskStatusObj);
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
        dispatch(setEditModal(false));
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
                dispatch(setEditModal(false));
            }}
            onDiscard={handleDiscard}
            size="medium"
            onSubmit={() => submitForm()}
            title="Edit Task Status"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="editTaskStatus">Task Status Name</label>
                            <input
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                id="editTaskStatus"
                                name="name"
                                type="text"
                                placeholder="Task Status Name"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="statusColor">Task Status Color</label>
                            <input onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setInputColor(e.target.value)} id="statusColor" name="color" type="color" />
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(EditTaskStatusModal);

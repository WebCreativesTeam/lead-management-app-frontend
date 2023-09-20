/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setDisableBtn, setEditModal, setFetching } from '@/store/Slices/taskSlice/manageTaskSlice';
import { useFormik } from 'formik';
import { taskSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Swal from 'sweetalert2';
import Loader from '@/components/__Shared/Loader';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const TaskEditModal = () => {
    const dispatch = useDispatch();
    const { isFetching, editModal, isBtnDisabled, singleData } = useSelector((state: IRootState) => state.task);

    useEffect(() => {
        setFieldValue('title', singleData?.title);
        setFieldValue('description', singleData?.description);
        setFieldValue('comment', singleData?.comment);
        setFieldValue('startDate', singleData?.startDate);
        setFieldValue('endDate', singleData?.endDate);
    }, [singleData]);

    const initialValues = {
        title: '',
        // lead: '64c90bd5c7cd824f606addcd',
        priority: {
            value: '',
            label: '',
        },
        startDate: '',
        endDate: '',
        assignedTo: '65081e4fb555280a3c8f4c44',
        observer: '65081e4fb555280a3c8f4c44',
        description: '',
        isActive: false,
        comment: '',
    };
    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: taskSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const editTaskObj = {
                    title: value.title,
                    comment: value.comment,
                    isActive: value.isActive,
                    startDate: new Date(value.startDate).toISOString(),
                    endDate: new Date(value.endDate).toISOString(),
                    description: value.description,
                    // lead: values.lead,
                };
                await new ApiClient().patch(`task/${singleData?.id}`, editTaskObj);
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

    const showAlert = async () => {
        if (errors.title) {
            showToastAlert(errors.title)
        } else if (errors.description) {
          showToastAlert(errors.description);
        }
    };
    return (
        <Modal
            open={editModal}
            onClose={() => {
                dispatch(setEditModal({ open: false }));
            }}
            onDiscard={() => {
                dispatch(setEditModal({ open: false }));
                resetForm();
            }}
            size="large"
            onSubmit={() => {
                errors && showAlert();
                submitForm();
            }}
            title="Edit Task"
            isBtnDisabled={values.title && values.description && values.startDate && values.endDate && values.comment && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="editTask">Task Title</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.title} id="editTask" name="title" type="text" placeholder="Task Title" className="form-input" />
                            </div>
                            {/* <div className="flex-1">
                                <label htmlFor="chooseLead">Choose Lead</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.lead} id="chooseLead" name="lead" type="text" placeholder="Choose Lead" className="form-input" />
                            </div> */}
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label>Task Start Date</label>
                                <Flatpickr
                                    data-enable-time
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        position: 'auto',
                                    }}
                                    id="taskStartDate"
                                    name="startDate"
                                    className="form-input"
                                    onChange={(e) => setFieldValue('startDate', e)}
                                    value={values.startDate}
                                />
                            </div>
                            <div className="flex-1">
                                <label>Task End Date</label>
                                <Flatpickr
                                    data-enable-time
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        position: 'auto',
                                    }}
                                    id="taskEndDate"
                                    name="endDate"
                                    className="form-input"
                                    onChange={(e) => setFieldValue('endDate', e)}
                                    value={values.endDate}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="taskDescription">Task Description</label>
                            <textarea
                                id="taskDescription"
                                rows={5}
                                name="description"
                                className="form-textarea"
                                placeholder="Enter Task Description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="taskComment"> Comment</label>
                            <textarea
                                id="taskComment"
                                rows={5}
                                className="form-textarea"
                                placeholder="Enter Task Comment"
                                name="comment"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.comment}
                            ></textarea>
                        </div>
                        <div>
                            <label className="inline-flex" htmlFor="taskActiveStatus">
                                <input
                                    type="checkbox"
                                    className="peer form-checkbox outline-success"
                                    id="taskActiveStatus"
                                    name="isActive"
                                    defaultChecked={singleData?.isActive}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('isActive', e.target.checked)}
                                />
                                <span className="peer-checked:text-success">Is Task Active</span>
                            </label>
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(TaskEditModal);

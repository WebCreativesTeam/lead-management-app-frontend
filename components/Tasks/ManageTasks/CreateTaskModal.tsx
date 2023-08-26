import React, { memo } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/taskSlice/manageTaskSlice';
import { useFormik } from 'formik';
import { taskSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Swal from 'sweetalert2';
import Loader from '@/components/__Shared/Loader';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { SelectOptionsType, TaskSelectOptions } from '@/utils/Types';

const TaskCreateModal = () => {
    const dispatch = useDispatch();
    const { isFetching, createModal, isBtnDisabled, taskPriorityList } = useSelector((state: IRootState) => state.task);

    const initialValues = {
        title: '',
        lead: '64c90bd5c7cd824f606addcd',
        priority: {
            value: '',
            label: '',
        },
        startDate: '',
        endDate: '',
        assignedTo: '64c90bd5c7cd824f606addce',
        observer: '64c90bd5c7cd824f606addd0',
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
                const createTaskObj = {
                    title: value.title,
                    comment: value.comment,
                    isActive: value.isActive,
                    startDate: new Date(value.startDate).toISOString(),
                    endDate: new Date(value.endDate).toISOString(),
                    description: value.description,
                    lead: values.lead,
                    observer: values.observer,
                    priority: value.priority.value,
                    assignedTo: values.assignedTo,
                };
                await new ApiClient().post('tasks', createTaskObj);
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

    const taskPriorityDropdown: SelectOptionsType[] = taskPriorityList?.map((item: TaskSelectOptions) => {
        return { value: item.id, label: item.name };
    });

    const showAlert = async () => {
        if (errors.title) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.title,
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
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={() => {
                dispatch(setCreateModal(false));
                resetForm();
            }}
            size="large"
            onSubmit={() => {
                errors && showAlert();
                submitForm();
            }}
            title="Create Task"
            isBtnDisabled={
                values.title &&
                values.assignedTo &&
                values.lead &&
                values.startDate &&
                values.endDate &&
                values.observer &&
                values.priority.value &&
                values.description &&
                values.comment &&
                !isBtnDisabled
                    ? false
                    : true
            }
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="createTask">Task Title</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.title} id="createTask" name="title" type="text" placeholder="Task Title" className="form-input" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="chooseLead">Choose Lead</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.lead} id="chooseLead" name="lead" type="text" placeholder="Choose Lead" className="form-input" />
                            </div>
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
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="taskAssignTo">Task Assign To</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.assignedTo}
                                    id="taskAssignTo"
                                    name="assignedTo"
                                    type="text"
                                    placeholder="Task Assign to"
                                    className="form-input"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="taskObserver">Task Observer</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.observer}
                                    id="taskObserver"
                                    name="observer"
                                    type="text"
                                    placeholder="Task Observer"
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="taskPriority">Task Priority</label>
                                <Select placeholder="Select task priority" options={taskPriorityDropdown} id="taskPriority" onChange={(e) => setFieldValue('priority', e)} />
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

export default memo(TaskCreateModal);

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
import { LeadDataType, SelectOptionsType, TaskSelectOptions, UserDataType } from '@/utils/Types';

const TaskCreateModal = () => {
    const dispatch = useDispatch();
    const { isFetching, createModal, isBtnDisabled, taskPriorityList, usersList, ledsList } = useSelector((state: IRootState) => state.task);

    const initialValues = {
        title: '',
        lead: {
            value: '',
            label: '',
        },
        priority: {
            value: '',
            label: '',
        },
        startDate: '',
        endDate: '',
        assignedTo: {
            value: '',
            label: '',
        },
        observer: {
            value: '',
            label: '',
        },
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
                    leadId: values.lead.value,
                    observerId: values.observer.value,
                    priorityId: value.priority.value,
                    assignedToId: values.assignedTo.value,
                };
                await new ApiClient().post('task', createTaskObj);
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

    const taskAssignToDropdown: SelectOptionsType[] = usersList?.map((item: UserDataType) => {
        return { value: item.id, label: `${item.firstName} ${item.lastName}` };
    });

    const taskObserverDropdown: SelectOptionsType[] = usersList?.map((item: UserDataType) => {
        return { value: item.id, label: `${item.firstName} ${item.lastName}` };
    });

    const taskLeadsDropdown: SelectOptionsType[] = ledsList?.map((item: LeadDataType) => {
        return { value: item.id, label: item?.contact?.name };
    });

    const showAlert = async () => {
        if (errors.title) {
            showToastAlert(errors.title);
        } else if (errors.description) {
            showToastAlert(errors.description);
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
                values.assignedTo.value &&
                values.lead &&
                values.startDate &&
                values.endDate &&
                values.observer.value &&
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
                                <label htmlFor="taskLead">Select Lead</label>
                                <Select placeholder="Select task Lead" options={taskLeadsDropdown} id="taskLead" onChange={(e) => setFieldValue('lead', e)} />
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
                                    placeholder="Task Start Date"
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
                                    placeholder="Task End Date"
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
                                <Select placeholder="Select task Assign To" options={taskAssignToDropdown} id="taskAssignTo" onChange={(e) => setFieldValue('assignedTo', e)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="taskObserver">Task Observer</label>
                                <Select placeholder="Select task observer" options={taskObserverDropdown} id="taskObserver" onChange={(e) => setFieldValue('observer', e)} />
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

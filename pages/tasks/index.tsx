/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import { taskSchema } from '@/utils/schemas';
import Swal from 'sweetalert2';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy, valuesIn } from 'lodash';
import Flatpickr from 'react-flatpickr';
import Select, { ActionMeta } from 'react-select';
import 'flatpickr/dist/flatpickr.css';
import { Close, Delete, Edit, Plus, View } from '@/components/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { SelectOptionsType, TaskSelectOptions } from '@/utils/Types';
import { TaskDataType } from '@/utils/Types';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';

const TaskPage = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Manage Tasks'));
    });

    //hooks
    const [data, setData] = useState<TaskDataType[]>([]);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [viewModal, setViewModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [singleTask, setSingleTask] = useState<any>({});
    const [singleViewTask, setSingleViewTask] = useState<any>({});
    const [singleDeleteTask, setSingleDeleteTask] = useState<any>('');
    const [disableBtn, setDisableBtn] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState('');
    const [forceRender, setForceRender] = useState<boolean>(false);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<TaskDataType[]>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [priorityOptions, setPriorityOptions] = useState<SelectOptionsType[]>([]);

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(searchedData, 'title'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'title',
        direction: 'asc',
    });
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    //get all task after page render
    useEffect(() => {
        getTasksList();
    }, [fetching]);

    useEffect(() => {
        getTasksPriority();
    }, []);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    // set initialValues when open modal
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

    //form handling
    const { values, handleChange, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: taskSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            setFetching(true);
            try {
                if (editModal) {
                    setDisableBtn(true);
                    const editTaskObj = {
                        title: value.title,
                        comment: value.comment,
                        isActive: value.isActive,
                        startDate: new Date(value.startDate).toISOString(),
                        endDate: new Date(value.endDate).toISOString(),
                        description: value.description,
                        lead: values.lead,
                    };
                    await axios.patch(process.env.NEXT_PUBLIC_API_LINK + 'tasks/' + singleTask.id, editTaskObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });
                    setDisableBtn(false);
                    action.resetForm();
                    setEditModal(false);
                } else if (createModal) {
                    setDisableBtn(true);
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
                    await axios.post(process.env.NEXT_PUBLIC_API_LINK + 'tasks/', createTaskObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });
                    setDisableBtn(false);
                    setCreateModal(false);
                    action.resetForm();
                }
            } catch (error: any) {
                setDisableBtn(true);
                if (typeof error?.response?.data?.message === 'object') {
                    setServerErrors(error?.response?.data?.message.join(' , '));
                } else {
                    setServerErrors(error?.response?.data?.message);
                }
                setServerErrors(error?.response?.data?.message);
                setDisableBtn(false);
            }
            setFetching(false);
        },
    });

    useEffect(() => {
        showServerAlert();
    }, [errors, serverErrors, forceRender]);
    useEffect(() => {}, [forceRender]);

    //server alerts
    const showServerAlert = () => {
        if (serverErrors) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: serverErrors,
                padding: '10px 20px',
            });
        }
        setServerErrors('');
    };
    //get single task by id
    const handleEditTask = (id: string): void => {
        setEditModal(true);
        const findTask: TaskDataType | any = data?.find((item: TaskDataType) => {
            return item.id === id;
        });
        setFieldValue('title', findTask?.title);
        setFieldValue('startDate', findTask?.startDate);
        setFieldValue('endDate', findTask?.endDate);
        setFieldValue('description', findTask?.description);
        setFieldValue('comment', findTask?.comment);
        setSingleTask(findTask);
    };

    //get all tasks list
    const getTasksList = async () => {
        try {
            setLoading(true);
            const res = await axios.get(process.env.NEXT_PUBLIC_API_LINK + 'tasks/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            const tasks = res?.data?.data;
            setData(tasks);
            setLoading(false);
        } catch (error: any) {
            if (typeof error?.response?.data?.message === 'object') {
                setServerErrors(error?.response?.data?.message.join(' , '));
            } else {
                setServerErrors(error?.response?.data?.message);
            }
            setServerErrors(error?.response?.data?.message);
        }
    };

    //get all task priority list obj
    const getTasksPriority = async () => {
        try {
            setLoading(true);
            const res = await axios.get(process.env.NEXT_PUBLIC_API_LINK + 'task-priorities/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            const taskPriorityAllData: TaskSelectOptions[] = res?.data?.data;
            const createTaskPriorityOptions: SelectOptionsType[] | any = taskPriorityAllData?.map((item: TaskSelectOptions) => {
                return {
                    value: item.id,
                    label: item.name,
                };
            });
            setPriorityOptions(createTaskPriorityOptions);
            // setData(tasks);
            setLoading(false);
        } catch (error: any) {
            if (typeof error?.response?.data?.message === 'object') {
                setServerErrors(error?.response?.data?.message.join(' , '));
            } else {
                setServerErrors(error?.response?.data?.message);
            }
            setServerErrors(error?.response?.data?.message);
        }
    };

    //showing validation error
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
        }
    };
    //alert and server alert execution
    const handleClickSubmit = () => {
        errors && showAlert();
        if (serverErrors) {
            if (forceRender === false) {
                setForceRender(true);
            } else {
                setForceRender(false);
            }
        }
    };

    const handleDiscard = () => {
        setEditModal(false);
        setDeleteModal(false);
        setCreateModal(false);
        resetForm();
    };

    // get single task for view modal
    const handleViewTask = (id: string) => {
        setViewModal(true);
        const findTask = data?.find((item: TaskDataType) => {
            return item.id === id;
        });
        setSingleViewTask(findTask);
    };

    // delete task by id

    const handleDeleteTask = (id: string) => {
        setDeleteModal(true);
        const findTask = data?.find((item: TaskDataType) => {
            return item.id === id;
        });
        setSingleDeleteTask(findTask?.id);
    };

    //deleting task
    const onDeleteTask = async () => {
        setFetching(true);
        try {
            setDisableBtn(true);
            await axios.delete(process.env.NEXT_PUBLIC_API_LINK + 'tasks/' + singleDeleteTask, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            setDisableBtn(false);
            setDeleteModal(false);
        } catch (error: any) {
            setDisableBtn(true);
            if (typeof error?.response?.data?.message === 'object') {
                setServerErrors(error?.response?.data?.message.join(' , '));
            } else {
                setServerErrors(error?.response?.data?.message);
            }
            setServerErrors(error?.response?.data?.message);
            setDisableBtn(false);
        }
        setFetching(false);
    };

    //search task
    const handleSearchTask = () => {
        const searchTaskData = data?.filter((task: TaskDataType) => {
            return (
                task.title.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                task.title.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                task.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchTaskData);
        setRecordsData(searchTaskData);
    };
    console.log(recordsData);
    return (
        <div>
            <PageHeadingSection description="View, create, update, and close tasks. Organize by status, priority, and due date. Stay on top of work." heading="Task Management" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                <div className="flex-1">
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => setCreateModal(true)}>
                        <Plus />
                        Add New Task
                    </button>
                </div>
                <div className="relative  flex-1">
                    <input type="text" placeholder="Find A Policy" className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]" onChange={(e) => setSearchInputText(e.target.value)} value={searchQuery} />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => handleSearchTask()}>
                        Search
                    </button>
                </div>
            </div>

            {/* Tasks List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'title',
                            title: 'Task Name',
                            sortable: true,
                            render: ({ title }) => <div>{title}</div>,
                        },
                        {
                            accessor: 'createdAt',
                            title: 'Created Date',
                            sortable: true,
                            render: ({ createdAt }) => <div>{new Date(createdAt).toLocaleString()}</div>,
                        },
                        {
                            accessor: 'updatedAt',
                            title: 'Last Updated',
                            sortable: true,
                            render: ({ updatedAt }) => <div>{new Date(updatedAt).toLocaleString()}</div>,
                        },
                        {
                            accessor: 'startDate',
                            title: 'Start Date',
                            sortable: true,
                            render: ({ createdAt }) => <div>{new Date(createdAt).toLocaleString()}</div>,
                        },
                        {
                            accessor: 'isActive',
                            title: 'Task Status',
                            sortable: true,
                            render: ({ status }) => (
                                <span
                                    className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                    style={{ color: status.color, backgroundColor: status.color + '20' }}
                                >
                                    {status.name}
                                </span>
                            ),
                        },
                        {
                            accessor: 'endDate',
                            title: 'End Date',
                            sortable: true,
                            render: ({ updatedAt }) => <div>{new Date(updatedAt).toLocaleString()}</div>,
                        },
                        {
                            accessor: 'action',
                            title: 'Actions',
                            titleClassName: '!text-center',
                            render: ({ id }) => (
                                <div className="flex justify-center gap-2  p-3 text-center ">
                                    <Tippy content="View">
                                        <button type="button" onClick={() => handleViewTask(id)}>
                                            <View />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => handleEditTask(id)}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => handleDeleteTask(id)}>
                                            <Delete />
                                        </button>
                                    </Tippy>
                                </div>
                            ),
                        },
                    ]}
                    totalRecords={initialRecords.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    fetching={loading}
                />
            </div>

            {/* edit modal */}

            <div className="mb-5">
                <Transition appear show={editModal} as={Fragment}>
                    <Dialog as="div" open={editModal} onClose={handleDiscard}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60 ">
                            <div className="flex min-h-screen items-center justify-center px-4 ">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full  overflow-visible rounded-lg border-0 p-0 text-black dark:text-white-dark sm:w-[43rem]">
                                        <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Edit Task</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div className="flex flex-col gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <label htmlFor="createTask">Task Title</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.title}
                                                            id="createTask"
                                                            name="title"
                                                            type="text"
                                                            placeholder="Task Title"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="chooseLead">Choose Lead</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.lead}
                                                            id="chooseLead"
                                                            name="lead"
                                                            type="text"
                                                            placeholder="Choose Lead"
                                                            className="form-input"
                                                        />
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
                                                            defaultChecked={singleTask?.isActive}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('isActive', e.target.checked)}
                                                        />
                                                        <span className="peer-checked:text-success">Is Task Active</span>
                                                    </label>
                                                </div>
                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleDiscard} disabled={disableBtn}>
                                                        Discard
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                                                        onClick={handleClickSubmit}
                                                        disabled={values.title && !disableBtn ? false : true}
                                                    >
                                                        Edit Task
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

            {/* view modal */}

            <div className="mb-5">
                <Transition appear show={viewModal} as={Fragment}>
                    <Dialog as="div" open={viewModal} onClose={() => setViewModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">View Task</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setViewModal(false)}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <ul className="flex flex-col gap-4">
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Task Name</span>
                                                    <p className="flex-[2]">{singleViewTask.title}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Task Description</span>
                                                    <p className="flex-[2]">{singleViewTask.description}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Task Comment</span>
                                                    <p className="flex-[2]">{singleViewTask.comment}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Task Created</span>
                                                    <p className="flex-[2]">{new Date(singleViewTask.createdAt).toLocaleString()}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Last Updated</span>
                                                    <p className="flex-[2]">{new Date(singleViewTask.updatedAt).toLocaleString()}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Task StartDate</span>
                                                    <p className="flex-[2]">{new Date(singleViewTask.startDate).toLocaleString()}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Task EndDate</span>
                                                    <p className="flex-[2]">{new Date(singleViewTask.endDate).toLocaleString()}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Task Status</span>
                                                    <p className="flex-[2]">{singleViewTask?.status?.name}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Task AssignBy</span>
                                                    <p className="flex-[2]">{singleViewTask?.assignedBy?.firstName + ' ' + singleViewTask?.assignedBy?.lastName}</p>
                                                </li>
                                            </ul>
                                            <div className="mt-8 flex items-center justify-center">
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setViewModal(false)}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

            {/* delete modal */}
            <ConfirmationModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                onDiscard={() => setDeleteModal(false)}
                description={
                    <>
                        Are you sure you want to delete this Task? <br /> It will not revert!
                    </>
                }
                title="Delete task priority"
                isBtnDisabled={disableBtn}
                onSubmit={onDeleteTask}
                btnSubmitText="Delete"
            />

            {/* create modal */}

            <div className="mb-5">
                <Transition appear show={createModal} as={Fragment}>
                    <Dialog as="div" open={createModal} onClose={handleDiscard}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60 ">
                            <div className="flex min-h-screen items-center justify-center px-4 ">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full  overflow-visible rounded-lg border-0 p-0 text-black dark:text-white-dark sm:w-[43rem]">
                                        <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Create Task</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div className="flex flex-col gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <label htmlFor="createTask">Task Title</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.title}
                                                            id="createTask"
                                                            name="title"
                                                            type="text"
                                                            placeholder="Task Title"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="chooseLead">Choose Lead</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.lead}
                                                            id="chooseLead"
                                                            name="lead"
                                                            type="text"
                                                            placeholder="Choose Lead"
                                                            className="form-input"
                                                        />
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
                                                        <Select placeholder="Select task priority" options={priorityOptions} id="taskPriority" onChange={(e) => setFieldValue('priority', e)} />
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
                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleDiscard} disabled={disableBtn}>
                                                        Discard
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                                                        onClick={handleClickSubmit}
                                                        disabled={values.title && !disableBtn ? false : true}
                                                    >
                                                        Create Task
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default TaskPage;

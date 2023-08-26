/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import 'flatpickr/dist/flatpickr.css';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { GetMethodResponseType, TaskSelectOptions } from '@/utils/Types';
import { TaskDataType } from '@/utils/Types';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Dropdown from '@/components/Dropdown';
import { IRootState } from '@/store';
import { getAllTaskPriorities, getAllTaskStatus, getAllTasks, setChangePriorityModal, setChangeStatusModal, setCreateModal, setDeleteModal, setEditModal, setViewModal } from '@/store/Slices/taskSlice/manageTaskSlice';
import { ApiClient } from '@/utils/http';
import DeleteTaskModal from '@/components/Tasks/ManageTasks/DeleteTaskModal';
import CreateTaskModal from '@/components/Tasks/ManageTasks/CreateTaskModal';
import EditTaskModal from '@/components/Tasks/ManageTasks/EditTaskModal';
import ViewTaskModal from '@/components/Tasks/ManageTasks/ViewTaskModal';
import ChangeTaskPriorityModal from '@/components/Tasks/ManageTasks/ChangeTaskPriorityModal';
import ChangeTaskStatusModal from '@/components/Tasks/ManageTasks/ChangeTaskStatusModal';

const TaskPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Manage Tasks'));
    });

    //hooks
    const { data, isFetching, taskPriorityList, taskStatusList } = useSelector((state: IRootState) => state.task);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<TaskDataType[]>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('assigned-by-me');

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
    }, [isFetching, filter]);

    useEffect(() => {
        getTasksPriority();
        getTaskStatus();
    }, []);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    //get all tasks list
    const getTasksList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('tasks?sort=-isDefault');
        const policies: TaskDataType[] = res?.data;
        if (Object.keys(policies).length === 0) {
            dispatch(getAllTasks([] as TaskDataType[]));
            return;
        }
        dispatch(getAllTasks(policies));
        setLoading(false);
    };

    //get all task priority list
    const getTasksPriority = async () => {
        setLoading(true);
        const taskPriorityList: GetMethodResponseType = await new ApiClient().get('task-priorities');
        const priorities: TaskSelectOptions[] = taskPriorityList?.data;
        if (Object.keys(priorities).length === 0) {
            dispatch(getAllTaskPriorities([] as TaskSelectOptions[]));
            return;
        }
        dispatch(getAllTaskPriorities(priorities));
    };

    //get all task status list
    const getTaskStatus = async () => {
        setLoading(true);
        const taskStatusList: GetMethodResponseType = await new ApiClient().get('task-status');
        const status: TaskSelectOptions[] = taskStatusList?.data;
        if (Object.keys(status).length === 0) {
            dispatch(getAllTaskStatus([] as TaskSelectOptions[]));
            return;
        }
        dispatch(getAllTaskStatus(status));
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

    return (
        <div>
            <PageHeadingSection description="View, create, update, and close tasks. Organize by status, priority, and due date. Stay on top of work." heading="Task Management" />
            <div className="my-6 flex gap-5 ">
                <div className="flex flex-1 gap-5 ">
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                        <Plus />
                        Add New Task
                    </button>
                    <div className="dropdown">
                        <Dropdown
                            placement="bottom-start"
                            btnClassName="btn btn-outline-primary h-full dropdown-toggle"
                            button={
                                <>
                                    <span>Filter</span>
                                </>
                            }
                        >
                            <ul className="!min-w-[170px]">
                                <li>
                                    <button type="button" onClick={() => setFilter('assigned-by-me')}>
                                        Assigned by Me
                                    </button>
                                </li>
                                <li>
                                    <button type="button" onClick={() => setFilter('assigned-to-me')}>
                                        Assigned to Me
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
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
                            accessor: 'status',
                            title: 'Task Status',
                            sortable: true,
                            render: ({ status, id }) => (
                                <div className="dropdown">
                                    <Dropdown
                                        placement="bottom-start"
                                        button={
                                            <>
                                                <span
                                                    className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                                    style={{ color: status.color, backgroundColor: status.color + '20' }}
                                                >
                                                    {status.name}
                                                </span>
                                            </>
                                        }
                                    >
                                        <ul className="!min-w-[170px]">
                                            {taskStatusList.map((status: TaskSelectOptions, i: number) => {
                                                return (
                                                    <li key={i}>
                                                        <button
                                                            className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                                            style={{ color: status.color, backgroundColor: status.color + '20' }}
                                                            onClick={() => dispatch(setChangeStatusModal({ statusId: status.id, taskId: id, open: true }))}
                                                        >
                                                            {status.name}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Dropdown>
                                </div>
                            ),
                        },
                        {
                            accessor: 'priority',
                            title: 'Task Priority',
                            sortable: true,
                            render: ({ priority, id }) => (
                                <div className="dropdown">
                                    <Dropdown
                                        placement="bottom-start"
                                        button={
                                            <>
                                                <span
                                                    className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                                    style={{ color: priority.color, backgroundColor: priority.color + '20' }}
                                                >
                                                    {priority.name}
                                                </span>
                                            </>
                                        }
                                    >
                                        <ul className="!min-w-[170px]">
                                            {taskPriorityList.map((priority: TaskSelectOptions, i: number) => {
                                                return (
                                                    <li key={i}>
                                                        <button
                                                            className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                                            style={{ color: priority.color, backgroundColor: priority.color + '20' }}
                                                            onClick={() => dispatch(setChangePriorityModal({ priorityId: priority.id, taskId: id, open: true }))}
                                                        >
                                                            {priority.name}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Dropdown>
                                </div>
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
                                        <button type="button" onClick={() => dispatch(setViewModal({ id, open: true }))}>
                                            <View />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => dispatch(setEditModal({ id, open: true }))}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => dispatch(setDeleteModal({ id, open: true }))}>
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
            <EditTaskModal />

            {/* view modal */}
            <ViewTaskModal />

            {/* delete modal */}
            <DeleteTaskModal />

            {/* change Status modal */}
            <ChangeTaskStatusModal />

            {/* change task priority modal */}
            <ChangeTaskPriorityModal />

            {/* create modal */}
            <CreateTaskModal />
        </div>
    );
};

export default TaskPage;

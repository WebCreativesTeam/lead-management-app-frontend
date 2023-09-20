/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import 'flatpickr/dist/flatpickr.css';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { BranchDataType, ContactDataType, GetMethodResponseType, LeadSelectOptions, SourceDataType } from '@/utils/Types';
import { LeadDataType } from '@/utils/Types';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Dropdown from '@/components/Dropdown';
import { IRootState } from '@/store';
import {
    getAllBranchForLead,
    getAllContactsForLead,
    getAllLeadPriorities,
    getAllLeadStatus,
    getAllLeads,
    getAllSourceForLead,
    setChangePriorityModal,
    setChangeStatusModal,
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
} from '@/store/Slices/leadSlice/manageLeadSlice';
import { ApiClient } from '@/utils/http';
import DeleteLeadModal from '@/components/Leads/ManageLeads/DeleteLeadModal';
import CreateLeadModal from '@/components/Leads/ManageLeads/CreateLeadModal';
import EditLeadModal from '@/components/Leads/ManageLeads/EditLeadModal';
import ViewLeadModal from '@/components/Leads/ManageLeads/ViewLeadModal';
// import ChangeLeadPriorityModal from '@/components/Leads/ManageLeads/ChangeLeadPriorityModal';
// import ChangeLeadStatusModal from '@/components/Leads/ManageLeads/ChangeLeadStatusModal';

const LeadPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Manage Leads'));
    });

    //hooks
    const { data, isFetching, leadPriorityList, leadStatusList, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate } = useSelector((state: IRootState) => state.lead);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<LeadDataType[]>(data);
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

    //get all lead after page render
    useEffect(() => {
        getLeadsList();
    }, [isFetching, filter]);

    useEffect(() => {
        getLeadsPriority();
        getLeadStatus();
        getContactsList();
        getBranchList();
        getSourceList();
    }, []);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    //get all leads list
    const getLeadsList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('lead');
        const leads: LeadDataType[] | undefined = res?.data;
        if (typeof leads === 'undefined') {
            dispatch(getAllLeads([] as LeadDataType[]));
            return;
        }
        dispatch(getAllLeads(leads));
        setLoading(false);
    };

    //get all contacts list
    const getContactsList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('contact');
        const contacts: ContactDataType[] = res?.data;
        if (typeof contacts === 'undefined') {
            dispatch(getAllContactsForLead([] as ContactDataType[]));
            return;
        }
        dispatch(getAllContactsForLead(contacts));
        setLoading(false);
    };

    //get all branches list
    const getBranchList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('branch');
        const branches: ContactDataType[] = res?.data;
        if (typeof branches === 'undefined') {
            dispatch(getAllBranchForLead([] as BranchDataType[]));
            return;
        }
        dispatch(getAllBranchForLead(branches));
        setLoading(false);
    };

    //get all source list
    const getSourceList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('source');
        const branches: ContactDataType[] = res?.data;
        if (typeof branches === 'undefined') {
            dispatch(getAllSourceForLead([] as SourceDataType[]));
            return;
        }
        dispatch(getAllSourceForLead(branches));
        setLoading(false);
    };

    //get all lead priority list
    const getLeadsPriority = async () => {
        setLoading(true);
        const leadPriorityList: GetMethodResponseType = await new ApiClient().get('lead-priority');
        const priorities: LeadSelectOptions[] = leadPriorityList?.data;
        if (typeof priorities === 'undefined') {
            dispatch(getAllLeadPriorities([] as LeadSelectOptions[]));
            return;
        }
        dispatch(getAllLeadPriorities(priorities));
    };

    //get all lead status list
    const getLeadStatus = async () => {
        setLoading(true);
        const leadStatusList: GetMethodResponseType = await new ApiClient().get('lead-status');
        const status: LeadSelectOptions[] = leadStatusList?.data;
        if (typeof status === 'undefined') {
            dispatch(getAllLeadStatus([] as LeadSelectOptions[]));
            return;
        }
        dispatch(getAllLeadStatus(status));
    };

    //search lead
    const handleSearchLead = () => {
        const searchLeadData = data?.filter((lead: LeadDataType) => {
            return (
                lead.DOB.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                lead.DOB.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                lead.DOB.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchLeadData);
        setRecordsData(searchLeadData);
    };

    return (
        <div>
            <PageHeadingSection description="View, create, update, and close leads. Organize by status, priority, and due date. Stay on top of work." heading="Lead Management" />
            <div className="my-6 flex gap-5 ">
                <div className="flex flex-1 gap-5 ">
                    {isAbleToCreate && (
                        <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Add New Lead
                        </button>
                    )}
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
                    <input type="text" placeholder="Find A Lead" className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]" onChange={(e) => setSearchInputText(e.target.value)} value={searchQuery} />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => handleSearchLead()}>
                        Search
                    </button>
                </div>
            </div>

            {/* Leads List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
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
                            title: 'Lead Status',
                            sortable: true,
                            render: ({ status, id }) => (
                                <div className="dropdown">
                                    <Dropdown
                                        placement="bottom-start"
                                        button={
                                            <>
                                                <span
                                                    className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                                    style={{ color: status.color, backgroundColor: status.color + '20' }}
                                                >
                                                    {status.name}
                                                </span>
                                            </>
                                        }
                                    >
                                        <ul className="max-h-32 !min-w-[170px] overflow-y-auto">
                                            {leadStatusList.map((status2: LeadSelectOptions, i: number) => {
                                                return (
                                                    <li key={i}>
                                                        <button
                                                            className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-400 dark:bg-blue-900 
                                                            dark:text-blue-300`}
                                                            onClick={() => dispatch(setChangeStatusModal({ statusId: status2.id, leadId: id, open: true }))}
                                                            disabled={status2?.id === status?.id}
                                                        >
                                                            {status2.name}
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
                            title: 'Lead Priority',
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
                                        <ul className="max-h-32 !min-w-[170px] overflow-y-auto">
                                            {leadPriorityList.map((priority2: LeadSelectOptions, i: number) => {
                                                return (
                                                    <li key={i}>
                                                        <button
                                                            className={`rounded px-2.5 py-0.5 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-400 dark:bg-blue-900 
                                                            dark:text-blue-300`}
                                                            onClick={() => dispatch(setChangePriorityModal({ priorityId: priority2.id, leadId: id, open: true }))}
                                                            disabled={priority2?.id === priority?.id}
                                                        >
                                                            {priority2.name}
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
                                    {isAbleToUpdate && (
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => dispatch(setEditModal({ id, open: true }))}>
                                                <Edit />
                                            </button>
                                        </Tippy>
                                    )}
                                    {isAbleToDelete && (
                                        <Tippy content="Delete">
                                            <button type="button" onClick={() => dispatch(setDeleteModal({ id, open: true }))}>
                                                <Delete />
                                            </button>
                                        </Tippy>
                                    )}
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
            <EditLeadModal />

            {/* view modal */}
            <ViewLeadModal />

            {/* delete modal */}
            <DeleteLeadModal />

            {/* change Status modal */}
            {/* <ChangeLeadStatusModal /> */}

            {/* change lead priority modal */}
            {/* <ChangeLeadPriorityModal /> */}

            {/* create modal */}
            <CreateLeadModal />
        </div>
    );
};

export default LeadPage;

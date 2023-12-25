/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import 'flatpickr/dist/flatpickr.css';
import { ChatIcon, Delete, Edit, Email, Plus, Sms, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import {
    BranchListSecondaryEndpoint,
    ContactDataType,
    GetMethodResponseType,
    ICustomField,
    LeadPrioritySecondaryEndpoint,
    LeadStatusSecondaryEndpoint,
    ProductSecondaryEndpointType,
    SourceDataType,
    UserListSecondaryEndpointType,
} from '@/utils/Types';
import { LeadDataType } from '@/utils/Types';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Dropdown from '@/components/Dropdown';
import { IRootState } from '@/store';
import {
    getAllBranchForLead,
    getAllContactsForLead,
    getAllCustomFieldsForLeads,
    getAllLeadPriorities,
    getAllLeadStatus,
    getAllLeads,
    getAllProductsForLead,
    getAllSourceForLead,
    setChangePriorityModal,
    setChangeStatusModal,
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setLeadDataLength,
    setViewModal,
} from '@/store/Slices/leadSlice/manageLeadSlice';
import { ApiClient } from '@/utils/http';
import DeleteLeadModal from '@/components/Leads/ManageLeads/DeleteLeadModal';
import CreateLeadModal from '@/components/Leads/ManageLeads/CreateLeadModal';
import EditLeadModal from '@/components/Leads/ManageLeads/EditLeadModal';
import ViewLeadModal from '@/components/Leads/ManageLeads/ViewLeadModal';
import ChangeLeadPriorityModal from '@/components/Leads/ManageLeads/ChangeLeadPriorityModal';
import ChangeLeadStatusModal from '@/components/Leads/ManageLeads/ChangeLeadStatusModal';
import Link from 'next/link';

const ManageLeads = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Manage Leads'));
    }, []);

    const cols: { accessor: string; title: string }[] = [
        { accessor: 'contactTitle', title: 'Name' },
        { accessor: 'contactEmail', title: 'Email' },
        { accessor: 'source', title: 'Source' },
        { accessor: 'createdAt', title: 'Created Date' },
        { accessor: 'updatedAt', title: 'Last Updated' },
        { accessor: 'startDate', title: 'Start Date' },
        { accessor: 'status', title: 'Lead Status' },
        { accessor: 'priority', title: 'Priority' },
        { accessor: 'endDate', title: 'End Date' },
    ];

    //hooks
    const { data, isFetching, leadPriorityList, leadStatusList, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, totalRecords, editModal, createModal } = useSelector(
        (state: IRootState) => state.lead
    );
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('assigned-by-me');
    const [search, setSearch] = useState<string>('');
    const [hideCols, setHideCols] = useState<string[]>(['contactTitle']);

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(search);

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<LeadDataType[]>([] as LeadDataType[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'title',
        direction: 'asc',
    });

    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    //get all lead after page render
    useEffect(() => {
        getLeadsList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        getLeadsPriority();
        getLeadStatus();
        getContactsList();
        getBranchList();
        getSourceList();
        getCustomFieldList();
        getAllProducts();
    }, []);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all leads list
    const getLeadsList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`lead?limit=${pageSize}&page=${page}&search=${searchQuery}`);
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
        const res: GetMethodResponseType = await new ApiClient().get('contact/list');
        const contacts: ContactDataType[] = res?.data;
        if (typeof contacts === 'undefined') {
            dispatch(getAllContactsForLead([] as ContactDataType[]));
            return;
        }
        dispatch(getAllContactsForLead(contacts));
        dispatch(setLeadDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    //get all branches list
    const getBranchList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('branch/list');
        const branches: BranchListSecondaryEndpoint[] = res?.data;
        if (typeof branches === 'undefined') {
            dispatch(getAllBranchForLead([] as BranchListSecondaryEndpoint[]));
            return;
        }
        dispatch(getAllBranchForLead(branches));
        setLoading(false);
    };

    //get all source list
    const getSourceList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('source/list');
        const sources: SourceDataType[] = res?.data;
        if (typeof sources === 'undefined') {
            dispatch(getAllSourceForLead([] as SourceDataType[]));
            return;
        }
        dispatch(getAllSourceForLead(sources));
        setLoading(false);
    };

    //get all lead priority list
    const getLeadsPriority = async () => {
        setLoading(true);
        const leadPriorityList: GetMethodResponseType = await new ApiClient().get('lead-priority/list');
        const priorities: LeadPrioritySecondaryEndpoint[] = leadPriorityList?.data;
        if (typeof priorities === 'undefined') {
            dispatch(getAllLeadPriorities([] as LeadPrioritySecondaryEndpoint[]));
            return;
        }
        dispatch(getAllLeadPriorities(priorities));
    };

    //get all lead status list
    const getLeadStatus = async () => {
        setLoading(true);
        const leadStatusList: GetMethodResponseType = await new ApiClient().get('lead-status/list');
        const status: LeadStatusSecondaryEndpoint[] = leadStatusList?.data;
        if (typeof status === 'undefined') {
            dispatch(getAllLeadStatus([] as LeadStatusSecondaryEndpoint[]));
            return;
        }
        dispatch(getAllLeadStatus(status));
    };

    const showHideColumns = (col: string) => {
        if (hideCols.includes(col)) {
            setHideCols((col: any) => hideCols.filter((d: any) => d !== col));
        } else {
            setHideCols([...hideCols, col]);
        }
    };

    //get all CustomField list
    const getCustomFieldList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`custom-field?sortBy=order`);
        const customField: ICustomField[] = res?.data;

        if (typeof customField === 'undefined') {
            dispatch(getAllCustomFieldsForLeads([] as ICustomField[]));
            return;
        }
        dispatch(getAllCustomFieldsForLeads(customField));
        setLoading(false);
    };

    //get products list
    const getAllProducts = async () => {
        setLoading(true);
        const productList: GetMethodResponseType = await new ApiClient().get('product/list');
        const products: ProductSecondaryEndpointType[] = productList?.data;
        if (typeof products === 'undefined') {
            dispatch(getAllProductsForLead([] as ProductSecondaryEndpointType[]));
            return;
        }
        dispatch(getAllProductsForLead(products));
    };
    return !isAbleToRead ? null : (
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
                    <input
                        type="text"
                        placeholder="Find A Lead"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <div className="dropdown">
                    <Dropdown
                        placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                        btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                        button={
                            <>
                                <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        }
                    >
                        <ul className="!min-w-[170px]">
                            {cols.map((col, i) => {
                                return (
                                    <li
                                        key={i}
                                        className="flex flex-col"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <div className="flex items-center px-4 py-1">
                                            <label className="mb-0 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!hideCols.includes(col.accessor)}
                                                    className="form-checkbox"
                                                    defaultValue={col.accessor}
                                                    onChange={(event: any) => {
                                                        setHideCols(event.target.value);
                                                        showHideColumns(col.accessor);
                                                    }}
                                                />
                                                <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                                            </label>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </Dropdown>
                </div>
                <div>
                    <button className="btn btn-outline-primary dropdown-toggle h-full">Bulk Import</button>
                </div>
                <div>
                    <button className="btn btn-outline-primary dropdown-toggle h-full">Bulk Delete</button>
                </div>
                <div>
                    <button className="btn btn-outline-primary dropdown-toggle h-full">Bulk Export</button>
                </div>
            </div>
            {/* Leads List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'contactTitle',
                            title: 'Name',
                            sortable: true,
                            render: ({ contact }) => <div>{`${contact?.title} ${contact?.name}`}</div>,
                            hidden: hideCols.includes('contactTitle'),
                        },
                        {
                            accessor: 'contactEmail',
                            title: 'Email',
                            sortable: true,
                            render: ({ contact }) => <div>{`${contact?.email}`}</div>,
                            hidden: hideCols.includes('contactEmail'),
                        },
                        {
                            accessor: 'source',
                            title: 'Source',
                            sortable: true,
                            render: ({ source }) => <div>{source?.name}</div>,
                            hidden: hideCols.includes('source'),
                        },
                        {
                            accessor: 'createdAt',
                            title: 'Created Date',
                            sortable: true,
                            render: ({ createdAt }) => <div>{new Date(createdAt).toLocaleString()}</div>,
                            hidden: hideCols.includes('createdAt'),
                        },
                        {
                            accessor: 'updatedAt',
                            title: 'Last Updated',
                            sortable: true,
                            render: ({ updatedAt }) => <div>{new Date(updatedAt).toLocaleString()}</div>,
                            hidden: hideCols.includes('updatedAt'),
                        },
                        {
                            accessor: 'startDate',
                            title: 'Start Date',
                            sortable: true,
                            render: ({ createdAt }) => <div>{new Date(createdAt).toLocaleString()}</div>,
                            hidden: hideCols.includes('startDate'),
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
                                            {leadStatusList.map((status2: LeadStatusSecondaryEndpoint, i: number) => {
                                                return (
                                                    <li key={i}>
                                                        <button
                                                            className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-400 dark:bg-blue-900 
                                                            dark:text-blue-300`}
                                                            onClick={() => dispatch(setChangeStatusModal({ statusId: status2.id, leadId: id, open: true }))}
                                                            disabled={status2?.id === status?.id}
                                                        >
                                                            <span
                                                                className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                                                style={{ color: status2?.color, backgroundColor: status2?.color + '20' }}
                                                            >
                                                                {status2?.name}
                                                            </span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Dropdown>
                                </div>
                            ),
                            hidden: hideCols.includes('status'),
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
                                            {leadPriorityList.map((priority2: LeadPrioritySecondaryEndpoint, i: number) => {
                                                return (
                                                    <li key={i}>
                                                        <button
                                                            className={`rounded px-2.5 py-0.5 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-400 dark:bg-blue-900 
                                                            dark:text-blue-300`}
                                                            onClick={() => dispatch(setChangePriorityModal({ priorityId: priority2.id, leadId: id, open: true }))}
                                                            disabled={priority2?.id === priority?.id}
                                                        >
                                                            <span
                                                                className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                                                style={{ color: priority2?.color, backgroundColor: priority2?.color + '20' }}
                                                            >
                                                                {priority2?.name}
                                                            </span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Dropdown>
                                </div>
                            ),
                            hidden: hideCols.includes('priority'),
                        },
                        {
                            accessor: 'quickMessage',
                            title: 'Quick Message',
                            titleClassName: '!text-center',
                            render: ({ id }) => (
                                <div className="flex justify-center gap-2  p-3 text-center ">
                                    <Tippy content="WhatsApp">
                                        <Link href={'/message/whatsapp'}>
                                            <Sms />
                                        </Link>
                                    </Tippy>
                                    {/* {isAbleToUpdate && ( */}
                                    <Tippy content="SMS">
                                        <Link href={'/message/sms'}>
                                            <ChatIcon />
                                        </Link>
                                    </Tippy>
                                    {/* )} */}
                                    {/* {isAbleToDelete && ( */}
                                    <Tippy content="Email">
                                        <Link href={'/message/email'}>
                                            <Email />
                                        </Link>
                                    </Tippy>
                                    {/* )} */}
                                </div>
                            ),
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
                    totalRecords={totalRecords}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    recordsPerPageOptions={data?.length < 10 ? [10] : PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    fetching={loading}
                />
            </div>

            {/* edit modal */}
            {isAbleToUpdate && editModal && <EditLeadModal />}

            {/* view modal */}
            <ViewLeadModal />

            {/* delete modal */}
            <DeleteLeadModal />

            {/* change Status modal */}
            <ChangeLeadStatusModal />

            {/* change lead priority modal */}
            <ChangeLeadPriorityModal />

            {/* create modal */}
            {isAbleToCreate && createModal && <CreateLeadModal />}
        </div>
    );
};

export default ManageLeads;

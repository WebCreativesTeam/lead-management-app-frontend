/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { GetMethodResponseType, LeadStatusType } from '@/utils/Types';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { ApiClient } from '@/utils/http';
import { getAllLeadStatus, setCreateModal, setDefaultStatusModal, setDeleteModal, setEditModal, setViewModal } from '@/store/Slices/leadSlice/leadStatusSlice';
import { IRootState } from '@/store';
import DeleteLeadStatusModal from '@/components/Leads/LeadStatus/DeleteLeadStatusModal';
import CreateLeadStatusModal from '@/components/Leads/LeadStatus/CreateLeadStatusModal';
import EditLeadStatusModal from '@/components/Leads/LeadStatus/EditLeadStatusModal';
import ChangeDefaultStatusModal from '@/components/Leads/LeadStatus/ChangeDefaultStatusModal';
import ViewLeadStatusModal from '@/components/Leads/LeadStatus/ViewLeadStatusModal';

const LeadStatusPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Leads Status Page'));
    });

    //hooks
    const { data, isFetching, isAbleToChangeDefaultStatus, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate } = useSelector((state: IRootState) => state.leadStatus);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<LeadStatusType[]>(data);
    const [loading, setLoading] = useState<boolean>(false);

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(searchedData, 'name'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
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

    //get all leadStatus after page render
    useEffect(() => {
        getLeadStatusList();
    }, [isFetching]);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    //get all LeadStatus list
    const getLeadStatusList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('lead-status?sortBy=-isDefault');
        const status: LeadStatusType[] = res?.data;
        if (typeof status === 'undefined') {
            dispatch(getAllLeadStatus([] as LeadStatusType[]));
            return;
        }
        dispatch(getAllLeadStatus(status));
        setLoading(false);
    };

    //search leadStatus
    const handleSearchLeadStatus = () => {
        const searchLeadStatusData = data?.filter((leadStatus: LeadStatusType) => {
            return (
                leadStatus.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                leadStatus.name.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                leadStatus.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchLeadStatusData);
        setRecordsData(searchedData);
    };
    return !isAbleToRead ? null : (
        <div>
            <PageHeadingSection description="Customize lead statuses. Monitor workflow. Update stages. Reflect real-time progress." heading="Manage Progress" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[250px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Add New Lead Status
                        </button>
                    </div>
                )}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find Lead Status"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchQuery}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={handleSearchLeadStatus}>
                        Search
                    </button>
                </div>
            </div>

            {/* Lead Status List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'name',
                            title: 'Lead Status Name',
                            sortable: true,
                            render: ({ name, color }) => (
                                <span className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: color, backgroundColor: color + '20' }}>
                                    {name}
                                </span>
                            ),
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
                            accessor: 'isDefault',
                            title: 'Default Status',
                            sortable: true,
                            render: ({ isDefault, id }) =>
                                isAbleToChangeDefaultStatus ? (
                                    <div>
                                        <label className="relative h-6 w-12">
                                            <input
                                                type="checkbox"
                                                className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                                id="custom_switch_checkbox1"
                                                name="permission"
                                                checked={isDefault}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setDefaultStatusModal({ switchValue: e.target.checked, id, open: true }))}
                                            />
                                            <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                                        </label>
                                    </div>
                                ) : isDefault ? (
                                    <div>
                                        <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">Default</span>
                                    </div>
                                ) : null,
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
            <EditLeadStatusModal />

            {/* view modal */}
            <ViewLeadStatusModal />

            {/* delete modal */}
            <DeleteLeadStatusModal />

            {/* create modal */}
            <CreateLeadStatusModal />

            {/* default status confirmationModal */}
            <ChangeDefaultStatusModal />
        </div>
    );
};

export default LeadStatusPage;

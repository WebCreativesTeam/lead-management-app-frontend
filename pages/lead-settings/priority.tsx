/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { GetMethodResponseType, LeadPriorityType } from '@/utils/Types';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { IRootState } from '@/store';
import { ApiClient } from '@/utils/http';
import { getAllLeadPriorities, setCreateModal, setDefaultPriorityModal, setEditModal, setLeadPriorityDataLength, setPage, setPageSize, setViewModal } from '@/store/Slices/leadSlice/leadPrioritySlice';
import { setDeleteModal } from '@/store/Slices/leadSlice/leadPrioritySlice';
import DeleteLeadPriorityModal from '@/components/Leads/LeadPriority/DeleteLeadPriorityModal';
import CreateLeadPriorityModal from '@/components/Leads/LeadPriority/CreateLeadPriorityModal';
import EditLeadPriorityModal from '@/components/Leads/LeadPriority/EditLeadPriorityModal';
import ChangeDefaultPriorityModal from '@/components/Leads/LeadPriority/ChangeDefaultPriorityModal';
import ViewLeadPriorityModal from '@/components/Leads/LeadPriority/ViewLeadPriorityModal';
import ToggleSwitch from '@/components/__Shared/ToggleSwitch';
import { PAGE_SIZES } from '@/utils/contant';

const LeadPriorityPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Leads Priority Page'));
    });

    //hooks
    const { data, isFetching, isAbleToChangeDefaultPriority, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, totalRecords, pageSize, page } = useSelector(
        (state: IRootState) => state.leadPriority
    );
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable

    const [recordsData, setRecordsData] = useState<LeadPriorityType[]>([] as LeadPriorityType[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(search);

    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        dispatch(setPage(1));
    }, [sortStatus]);

    //get all leadPriority after page render
    useEffect(() => {
        getLeadPriorityList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all LeadPriority list
    const getLeadPriorityList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`lead-priority?limit=${pageSize}&page=${page}&search=${searchQuery}&sortBy=-isDefault`);
        const priority: LeadPriorityType[] = res?.data;
        if (typeof priority === 'undefined') {
            dispatch(getAllLeadPriorities([] as LeadPriorityType[]));
            return;
        }
        dispatch(getAllLeadPriorities(priority));
        dispatch(setLeadPriorityDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    return !isAbleToRead ? null : (
        <div>
            <PageHeadingSection description="Define lead priorities. Arrange by urgency. Optimize lead distribution. Enhance productivity." heading="Lead Importance" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[250px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Add New Lead Priority
                        </button>
                    </div>
                )}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find Lead Priority"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* Lead Priority List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'index',
                            title: '#',
                            width: 40,
                            render: ({ srNo }) => srNo,
                        },
                        {
                            accessor: 'name',
                            title: 'Lead Priority Name',
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
                            title: 'Default Priority',
                            sortable: true,
                            render: ({ isDefault, id }) =>
                                isAbleToChangeDefaultPriority ? (
                                    <div>
                                        <label className="relative h-6 w-12">
                                            <input
                                                type="checkbox"
                                                className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                                id="custom_switch_checkbox1"
                                                name="permission"
                                                checked={isDefault}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setDefaultPriorityModal({ switchValue: e.target.checked, id, open: true }))}
                                            />
                                            <ToggleSwitch />
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
                    totalRecords={totalRecords}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(page) => dispatch(setPage(page))}
                    recordsPerPageOptions={data?.length < 10 ? [10] : PAGE_SIZES}
                    onRecordsPerPageChange={(recordsPerPage) => dispatch(setPageSize(recordsPerPage))}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    fetching={loading}
                />
            </div>

            {/* edit modal */}
            <EditLeadPriorityModal />

            {/* view modal */}
            <ViewLeadPriorityModal />

            {/* delete modal */}
            <DeleteLeadPriorityModal />

            {/* create modal */}
            <CreateLeadPriorityModal />

            {/* default priority confirmationModal */}
            <ChangeDefaultPriorityModal />
        </div>
    );
};

export default LeadPriorityPage;

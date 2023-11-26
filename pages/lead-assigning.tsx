/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { GetMethodResponseType, ILeadRules, SourceDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import { getAllLeadRules, getAllSourceForLeadRule, setCreateModal, setDeleteModal, setEditModal, setLeadRuleDataLength, setViewModal } from '@/store/Slices/leadSlice/leadRuleSlice';
import LeadRuleViewModal from '@/components/Leads/LeadRule/LeadRuleViewModal';
import LeadRuleCreateModal from '@/components/Leads/LeadRule/LeadRuleCreateModal';
import LeadRuleEditModal from '@/components/Leads/LeadRule/LeadRuleEditModal';
import LeadRuleDeleteModal from '@/components/Leads/LeadRule/LeadRuleDeleteModal';

const LeadAssigning = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Track Leads | LeadRules'));
    });
    const { data, isFetching, isBtnDisabled, deleteModal, singleData, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, totalRecords } = useSelector((state: IRootState) => state.leadRule);

    //hooks
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<ILeadRules[]>([] as ILeadRules[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });
    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(search);

    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    //get all leadRule after page render
    useEffect(() => {
        getLeadRuleList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    useEffect(() => {
        getAllSourceList();
    }, []);

    //get all LeadRule list
    const getLeadRuleList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`source?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        const leadRule: ILeadRules[] = res?.data;
        if (typeof leadRule === 'undefined') {
            dispatch(getAllLeadRules([] as ILeadRules[]));
            return;
        }
        dispatch(getAllLeadRules(leadRule));
        dispatch(setLeadRuleDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    //get all Source list
    const getAllSourceList = async () => {
        setLoading(true);
        const sourceList: GetMethodResponseType = await new ApiClient().get('source/list');
        const source: SourceDataType[] = sourceList?.data;
        if (typeof source === 'undefined') {
            dispatch(getAllSourceForLeadRule([] as SourceDataType[]));
            return;
        }
        dispatch(getAllSourceForLeadRule(source));
    };

    return (
        <div>
            <PageHeadingSection description="Identify and categorize lead leadRules. Update descriptions. Add or remove leadRule channels." heading="Track Leads" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {/* {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : ( */}
                <div className="flex-1">
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                        <Plus />
                        Add New Rule
                    </button>
                </div>
                {/* )} */}
                <div className="relative flex-1">
                    <input type="text" placeholder="Find Rule" className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]" onChange={(e) => setSearchInputText(e.target.value)} value={searchInputText} />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* leadRule List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'name',
                            title: 'LeadRule Name',
                            sortable: true,
                            render: ({ name }) => <div>{name}</div>,
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
                                    {/* {isAbleToUpdate && ( */}
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => dispatch(setEditModal({ id, open: true }))}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    {/* )} */}
                                    {/* {isAbleToDelete && ( */}
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => dispatch(setDeleteModal({ id, open: true }))}>
                                            <Delete />
                                        </button>
                                    </Tippy>
                                    {/* )} */}
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
            <LeadRuleEditModal />

            {/* view modal */}
            <LeadRuleViewModal />

            {/* delete modal */}
            <LeadRuleDeleteModal />

            {/* create modal */}
            <LeadRuleCreateModal />
        </div>
    );
};

export default LeadAssigning;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { GetMethodResponseType, ILeadAssignment, ProductSecondaryEndpointType, SourceDataType, UserListSecondaryEndpointType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import {
    getAllLeadAssignments,
    getAllProductsForLeadAssignment,
    getAllSourceForLeadAssignment,
    getAllUsersForLeadAssignment,
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setLeadAssignmentActivationModal,
    setLeadAssignmentDataLength,
    setPage,
    setPageSize,
    setViewModal,
} from '@/store/Slices/leadSlice/leadAssigningSlice';
import LeadAssignmentViewModal from '@/components/Leads/LeadAssignment/LeadAssignmentViewModal';
import LeadAssignmentCreateModal from '@/components/Leads/LeadAssignment/LeadAssignmentCreateModal';
import LeadAssignmentEditModal from '@/components/Leads/LeadAssignment/LeadAssignmentEditModal';
import LeadAssignmentDeleteModal from '@/components/Leads/LeadAssignment/LeadAssignmentDeleteModal';
import ToggleSwitch from '@/components/__Shared/ToggleSwitch';
import LeadAssignmentActivationModal from '@/components/Leads/LeadAssignment/LeadAssignmentActivationModal';
import { PAGE_SIZES } from '@/utils/contant';

const LeadAssigning = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Track Leads | LeadAssignments'));
    });
    const {
        data,
        isFetching,
        deleteModal,
        isAbleToCreate,
        isAbleToDelete,
        isAbleToUpdate,
        totalRecords,
        editModal,
        createModal,
        viewModal,
        isAbleToActivate,
        pageSize,
        page,
        leadAssignmentActivationModal,
    } = useSelector((state: IRootState) => state.leadAssignment);

    //hooks
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable

    const [recordsData, setRecordsData] = useState<ILeadAssignment[]>([] as ILeadAssignment[]);
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

    //get all leadAssignment after page render
    useEffect(() => {
        getLeadAssignmentList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    useEffect(() => {
        getAllSourceList();
        getAllUsersList();
        getAllProducts();
    }, []);

    //get all LeadAssignment list
    const getLeadAssignmentList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`lead-assignment?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        const leadAssignment: ILeadAssignment[] = res?.data;
        if (typeof leadAssignment === 'undefined') {
            dispatch(getAllLeadAssignments([] as ILeadAssignment[]));
            return;
        }
        dispatch(getAllLeadAssignments(leadAssignment));
        dispatch(setLeadAssignmentDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    //get all Source list
    const getAllSourceList = async () => {
        setLoading(true);
        const sourceList: GetMethodResponseType = await new ApiClient().get('source/list');
        const source: SourceDataType[] = sourceList?.data;
        if (typeof source === 'undefined') {
            dispatch(getAllSourceForLeadAssignment([] as SourceDataType[]));
            return;
        }
        dispatch(getAllSourceForLeadAssignment(source));
    };

    //get all user's list
    const getAllUsersList = async () => {
        setLoading(true);
        const usersList: GetMethodResponseType = await new ApiClient().get('user/list');
        const users: UserListSecondaryEndpointType[] = usersList?.data;
        if (typeof users === 'undefined') {
            dispatch(getAllUsersForLeadAssignment([] as UserListSecondaryEndpointType[]));
            return;
        }
        dispatch(getAllUsersForLeadAssignment(users));
    };

    //get products list
    const getAllProducts = async () => {
        const productsList: GetMethodResponseType = await new ApiClient().get('product/list');
        const products: ProductSecondaryEndpointType[] = productsList?.data;
        if (typeof products === 'undefined') {
            dispatch(getAllProductsForLeadAssignment([] as ProductSecondaryEndpointType[]));
            return;
        }
        dispatch(getAllProductsForLeadAssignment(products));
    };

    return (
        <div>
            <PageHeadingSection description="Identify and categorize lead lead Assignments. Update descriptions. Add or remove leadAssignment channels." heading="Track Leads" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Add New Rule
                        </button>
                    </div>
                )}
                <div className="relative flex-1">
                    <input type="text" placeholder="Find Rule" className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]" onChange={(e) => setSearchInputText(e.target.value)} value={searchInputText} />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* leadAssignment List table*/}
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
                            title: 'Lead Assigning Name',
                            sortable: true,
                            render: ({ name }) => <div>{name}</div>,
                        },
                        {
                            accessor: 'source',
                            title: 'Source',
                            sortable: true,
                            render: ({ source, isAllSource }) => (isAllSource ? <div>All</div> : <div>{source?.name}</div>),
                        },
                        {
                            accessor: 'product',
                            title: 'Product',
                            sortable: true,
                            render: ({ product, isAllProduct }) => (isAllProduct ? <div>All</div> : <div>{product?.name}</div>),
                        },
                        {
                            accessor: 'active',
                            title: 'Active',
                            sortable: true,
                            render: ({ isActive, id }) => (
                                // isAbleToChangeDefaultStatus ? (
                                <div>
                                    <label className="relative h-6 w-12">
                                        <input
                                            type="checkbox"
                                            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                            id="custom_switch_checkbox1"
                                            name="active"
                                            checked={isActive}
                                            onChange={() => dispatch(setLeadAssignmentActivationModal({ id, open: true }))}
                                        />
                                        <ToggleSwitch />
                                    </label>
                                </div>
                            ),
                            // ) : (
                            //     isDefault && (
                            //         <div>
                            //             <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">Default</span>
                            //         </div>
                            //     )
                            // ),
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
            <LeadAssignmentEditModal />

            {/* view modal */}
            {viewModal && <LeadAssignmentViewModal />}

            {/* delete modal */}
            {isAbleToDelete && deleteModal && <LeadAssignmentDeleteModal />}

            {/* create modal */}
            {isAbleToCreate && createModal && <LeadAssignmentCreateModal />}

            {/* lead assignment activate modal */}
            {isAbleToActivate && leadAssignmentActivationModal && <LeadAssignmentActivationModal />}
        </div>
    );
};

export default LeadAssigning;

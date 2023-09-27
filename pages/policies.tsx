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
import { GetMethodResponseType, Permission, PolicyDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { getAllPermissions, getAllPolicies, setCreateModal, setDefaultPolicyModal, setDeleteModal, setEditModal, setPolicyDataLength, setViewModal } from '@/store/Slices/policySlice';
import { IRootState } from '@/store';
import PolicyCreateModal from '@/components/Policy/PolicyCreateModal';
import PolicyEditModal from '@/components/Policy/PolicyEditModal';
import ChangeDefaultPolicyModal from '@/components/Policy/ChangeDefaultPolicyModal';
import PolicyDeleteModal from '@/components/Policy/PolicyDeleteModal';
import PolicyViewModal from '@/components/Policy/PolicyViewModal';

const PolicyPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Define Access | Policies'));
    });

    //hooks
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, isAbleToChangeDefaultPolicy, totalRecords } = useSelector((state: IRootState) => state.policy);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<PolicyDataType[]>([] as PolicyDataType[]);
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

    //get all policy after page render
    useEffect(() => {
        getPolicyList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        getPermissionList();
    }, []);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all policy list
    const getPolicyList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`policy?sortBy=-isDefault&limit=${pageSize}&page=${page}`);
        const policies: PolicyDataType[] = res?.data;
        if (typeof policies === 'undefined') {
            dispatch(getAllPolicies([] as PolicyDataType[]));
            return;
        }
        dispatch(getAllPolicies(policies));
        dispatch(setPolicyDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    //get all policy list
    const getPermissionList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('policy/rules');
        const permissions: Permission[] = res?.data;
        if (typeof permissions === 'undefined') {
            dispatch(getAllPermissions([] as Permission[]));
            return;
        }
        dispatch(getAllPermissions(permissions));
        setLoading(false);
    };

    return !isAbleToRead ? null : (
        <div>
            <PageHeadingSection description="Craft policies for in-app permissions. Link to users. Ensure secure and relevant access." heading="Define Access" />

            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Add New Policy
                        </button>
                    </div>
                )}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find A Policy"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* Policy List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    fetching={loading}
                    columns={[
                        {
                            accessor: 'name',
                            title: 'Policy Name',
                            sortable: true,
                            render: ({ name }) => <div>{name}</div>,
                        },
                        {
                            accessor: 'description',
                            title: 'Description',
                            sortable: true,
                            render: ({ description }) => <div className="max-w-sm overflow-hidden">{description.slice(0, 55) + '...'}</div>,
                        },
                        {
                            accessor: 'isDefault',
                            title: 'Default Policy',
                            sortable: true,
                            render: ({ isDefault, id }) =>
                                isAbleToChangeDefaultPolicy ? (
                                    <div>
                                        <label className="relative h-6 w-12">
                                            <input
                                                type="checkbox"
                                                className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                                id="custom_switch_checkbox1"
                                                name="permission"
                                                checked={isDefault}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setDefaultPolicyModal({ id, open: true, switchValue: e.target.checked }))}
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
                />
            </div>

            {/* default policy confirmation Modal */}
            <ChangeDefaultPolicyModal />

            {/* edit modal */}
            <PolicyEditModal />

            {/* view modal */}
            <PolicyViewModal />

            {/* delete modal */}
            <PolicyDeleteModal />

            {/* create modal */}
            <PolicyCreateModal />
        </div>
    );
};

export default PolicyPage;

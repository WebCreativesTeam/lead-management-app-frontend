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
import { getAllPermissions, getAllPolicies, setCreateModal, setDefaultPolicyModal, setDeleteModal, setEditModal, setViewModal } from '@/store/Slices/policySlice';
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
    const { data, isFetching } = useSelector((state: IRootState) => state.policy);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<PolicyDataType[]>(data);
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

    //get all policy after page render
    useEffect(() => {
        getPolicyList();
    }, [isFetching]);

    useEffect(() => {
        getPermissionList();
    }, []);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    //get all policy list
    const getPolicyList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('policies?sort=-isDefault');
        const policies: PolicyDataType[] = res?.data;
        if (typeof policies === "undefined") {
            dispatch(getAllPolicies([] as PolicyDataType[]));
            return;
        }
        dispatch(getAllPolicies(policies));
        setLoading(false);
    };

    //get all policy list
    const getPermissionList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('policies/rules');
        const permissions: Permission[] = res?.data;
        if (typeof permissions === "undefined") {
            dispatch(getAllPermissions([] as Permission[]));
            return;
        }
        dispatch(getAllPermissions(permissions));
        setLoading(false);
    };

    //search policy
    const handleSearchPolicy = () => {
        const searchPolicyData = data?.filter((policy: PolicyDataType) => {
            return (
                policy.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                policy.name.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                policy.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchPolicyData);
        setRecordsData(searchPolicyData);
    };

    return (
        <div>
            <PageHeadingSection description="Craft policies for in-app permissions. Link to users. Ensure secure and relevant access." heading="Define Access" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                <div className="flex-1">
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                        <Plus />
                        Add New Policy
                    </button>
                </div>
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find A Policy"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={handleSearchPolicy}>
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
                            render: ({ description }) => <div>{description}</div>,
                        },
                        {
                            accessor: 'isDefault',
                            title: 'Default Policy',
                            sortable: true,
                            render: ({ isDefault, id }) => (
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

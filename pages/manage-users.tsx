/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Delete, Edit, Plus, Shield, View } from '@/utils/icons';
import { UserDataType, PolicyListSecondaryEndpoint, GetMethodResponseType } from '@/utils/Types';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ApiClient } from '@/utils/http';
import { getAllPolicies, getAllUsers, setCreateModal, setDeactivateModal, setDeleteModal, setEditModal, setPolicyModal, setUserDataLength, setViewModal } from '@/store/Slices/userSlice';
import { IRootState } from '@/store';
import UserCreateModal from '@/components/Users/UserCreateModal';
import UserViewModal from '@/components/Users/UserViewModal';
import UserEditModal from '@/components/Users/UserEditModal';
import UserPolicyModal from '@/components/Users/UserPolicyModal';
import UserDeactivateModal from '@/components/Users/UserDeactivateModal';
import { sortBy } from 'lodash';
import UserDeleteModal from '@/components/Users/UserDeleteModal';
import ToggleSwitch from '@/components/__Shared/ToggleSwitch';

const ManageUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Manage Users'));
    });
    //hooks
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, isAbleToUpdatePolicy, isAbleToChangeActiveStatus, totalRecords } = useSelector(
        (state: IRootState) => state.user
    );
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState([] as UserDataType[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(search);

    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    //get all user after page render
    useEffect(() => {
        getUsersList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        getPolicyList();
    }, []);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all users list
    const getUsersList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`user?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        const users: UserDataType[] = res?.data;
        if (typeof users === 'undefined') {
            dispatch(getAllUsers([] as UserDataType[]));
            return;
        }
        dispatch(getAllUsers(users));
        dispatch(setUserDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    const getPolicyList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('policy/list');
        const policies: PolicyListSecondaryEndpoint[] = res?.data;
        if (typeof policies === 'undefined') {
            dispatch(getAllPolicies([] as PolicyListSecondaryEndpoint[]));
            return;
        }
        dispatch(getAllPolicies(policies));
        setLoading(false);
    };

    return !isAbleToRead ? null : (
        <div>
            <PageHeadingSection description="Add, edit, or remove users. Assign roles. Track activity. Personalize user experience." heading="Manage Users" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Add New User
                        </button>
                    </div>
                )}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find A User"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* User List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'firstName',
                            title: 'First Name',
                            sortable: true,
                            render: ({ firstName }) => <div>{firstName}</div>,
                        },
                        {
                            accessor: 'lastName',
                            title: 'Last Name',
                            sortable: true,
                            render: ({ lastName }) => <div>{lastName}</div>,
                        },
                        {
                            accessor: 'email',
                            title: 'Email',
                            sortable: true,
                            render: ({ email }) => <div className="break-all">{email}</div>,
                        },
                        {
                            accessor: 'isActive',
                            title: 'Activate Status',
                            sortable: true,
                            render: ({ isActive, id }) =>
                                isAbleToChangeActiveStatus ? (
                                    <div>
                                        <label className="relative h-6 w-12">
                                            <input
                                                type="checkbox"
                                                className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                                id="custom_switch_checkbox1"
                                                name="permission"
                                                checked={isActive}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setDeactivateModal({ open: true, id, value: e.target.checked }))}
                                            />
                                            <ToggleSwitch />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        {isActive ? (
                                            <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-blue-900 dark:text-blue-300">Active</span>
                                        ) : (
                                            <span className="mr-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">In Active</span>
                                        )}
                                    </div>
                                ),
                        },
                        {
                            accessor: 'isVerified',
                            title: 'Verified Status',
                            sortable: true,
                            render: ({ isVerified }) => (
                                <div>
                                    {isVerified ? (
                                        <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">Verified</span>
                                    ) : (
                                        <span className="mr-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">Unverified</span>
                                    )}
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
                                    {isAbleToUpdatePolicy && (
                                        <Tippy content="Policy">
                                            <button type="button" onClick={() => dispatch(setPolicyModal({ id, open: true }))}>
                                                <Shield />
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
            <UserEditModal />

            {/* view modal */}
            <UserViewModal />

            {/* delete modal */}
            <UserDeleteModal />

            {/* Deactivate modal */}
            <UserDeactivateModal />

            {/* Policy modal */}
            <UserPolicyModal />

            {/* create modal */}
            <UserCreateModal />
        </div>
    );
};

export default ManageUsers;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue, ChangeEvent } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Swal from 'sweetalert2';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Delete, Edit, Plus, Shield, View } from '@/utils/icons';
import { UserDataType, PolicyDataType, GetMethodResponseType } from '@/utils/Types';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ApiClient } from '@/utils/http';
import { getAllPolicies, getAllUsers, setCreateModal, setDeactivateModal, setDeleteModal, setDisableBtn, setEditModal, setFetching, setPolicyModal, setViewModal } from '@/store/Slices/userSlice';
import { IRootState } from '@/store';
import UserCreateModal from '@/components/Users/UserCreateModal';
import UserViewModal from '@/components/Users/UserViewModal';
import UserEditModal from '@/components/Users/UserEditModal';
import UserPolicyModal from '@/components/Users/UserPolicyModal';
import UserDeactivateModal from '@/components/Users/UserDeactivateModal';
import { sortBy } from 'lodash';

const Users = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Manage Users'));
    });
    //hooks
    const data: UserDataType[] = useSelector((state: IRootState) => state.user.data);
    const fetching: boolean = useSelector((state: IRootState) => state.user.isFetching);
    const isBtnDisabled: boolean = useSelector((state: IRootState) => state.user.isBtnDisabled);
    const deleteModal: boolean = useSelector((state: IRootState) => state.user.deleteModal);
    const singleUser: UserDataType = useSelector((state: IRootState) => state.user.singleData);

    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<UserDataType[]>(data);
    const [loading, setLoading] = useState<boolean>(false);

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(searchedData, 'name'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
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

    //get all user after page render
    useEffect(() => {
        getUsersList();
    }, [fetching]);

    useEffect(() => {
        getPolicyList();
    }, []);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    //get all users list
    const getUsersList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('users');
        const users: UserDataType[] = res?.data;
        if (Object.keys(users).length === 0) {
            dispatch(getAllUsers([] as UserDataType[]));
            return;
        }
        dispatch(getAllUsers(users));
        setLoading(false);
    };
    const getPolicyList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('policies');
        const policies: PolicyDataType[] = res?.data;
        if (Object.keys(policies).length === 0) {
            dispatch(getAllPolicies([] as PolicyDataType[]));
            return;
        }
        dispatch(getAllPolicies(policies));
        setLoading(false);
    };

    //deleting User
    const onDeleteUser = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        await new ApiClient().delete('users/' + singleUser.id);
        dispatch(setDisableBtn(false));
        dispatch(setDeleteModal({ open: false }));
        dispatch(setFetching(false));
    };

    //search user
    const handleSearchUser = () => {
        const searchUserData = data?.filter((user: UserDataType) => {
            return (
                user.firstName.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                user.firstName.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                user.lastName.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                user.lastName.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                user.email.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                user.email.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                user.firstName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                user.lastName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchUserData);
        setRecordsData(searchUserData);
    };

    return (
        <div>
            <PageHeadingSection description="Add, edit, or remove users. Assign roles. Track activity. Personalize user experience." heading="Manage Users" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                <div className="flex-1">
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                        <Plus />
                        Add New User
                    </button>
                </div>
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find A User"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={handleSearchUser}>
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
                            render: ({ isActive, id }) => (
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
                                        <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                                    </label>
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
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => dispatch(setEditModal({ id, open: true }))}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Policy">
                                        <button type="button" onClick={() => dispatch(setPolicyModal({ id, open: true }))}>
                                            <Shield />
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
            <UserEditModal />

            {/* view modal */}
            <UserViewModal />

            {/* delete modal */}
            <ConfirmationModal
                open={deleteModal}
                onClose={() => dispatch(setDeleteModal({ open: false }))}
                onDiscard={() => dispatch(setDeleteModal({ open: false }))}
                description={<>Are you sure you want to delete this User? It will also remove form database. And, It will not revert!</>}
                title="Delete User"
                isBtnDisabled={isBtnDisabled}
                onSubmit={onDeleteUser}
                btnSubmitText="Delete"
            />

            {/* Deactivate modal */}
            <UserDeactivateModal />

            {/* Policy modal */}
            <UserPolicyModal />

            {/* create modal */}
            <UserCreateModal />
        </div>
    );
};

export default Users;

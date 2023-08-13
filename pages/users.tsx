/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue, ChangeEvent } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import { createUserSchema, editUserSchema } from '@/utils/schemas';
import Swal from 'sweetalert2';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import Select, { ActionMeta } from 'react-select';
import { Close, Delete, Edit, Plus, Shield, SnackLine, View, WalkingMan } from '@/components/icons';
import { UserDataType, SelectOptionsType, Permission, PolicyDataType } from '@/utils/Types';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';

const Users = () => {
    //hooks
    const [data, setData] = useState<UserDataType[]>([]);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [viewModal, setViewModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [deactivateModal, setDeactivateModal] = useState<boolean>(false);
    const [policyModal, setPolicyModal] = useState<boolean>(false);
    const [singleUserEdit, setSingleUserEdit] = useState<any>({});
    const [singleViewUser, setSingleViewUser] = useState<any>({});
    const [singleDeleteUser, setSingleDeleteUser] = useState<any>('');
    const [singleDeactivateUserId, setSingleDeactivateUserId] = useState<any>('');
    const [disableBtn, setDisableBtn] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState('');
    const [forceRender, setForceRender] = useState<boolean>(false);
    const [permissionArr, setPermissionArr] = useState<Permission[]>([]);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<UserDataType[]>(data);
    const [deactivateVal, setDeactivateVal] = useState<boolean>(false);
    const [policiesData, setPoliciesData] = useState([]);
    const [userPolicyId, setUserPolicyId] = useState<string>();
    const [defaultSelectedPolicy, setDefaultSelectedPolicy] = useState<SelectOptionsType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);

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
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    // set initialValues when open modal
    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    //form handling
    const { values, handleChange, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: createModal ? createUserSchema : editUserSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            setFetching(true);
            try {
                if (editModal) {
                    setDisableBtn(true);
                    const editUserObj = {
                        firstName: value.firstname,
                        lastName: value.lastname,
                    };
                    await axios.patch(process.env.NEXT_PUBLIC_API_LINK + 'users/' + +singleUserEdit.id, editUserObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });
                    setDisableBtn(false);
                    action.resetForm();
                    setEditModal(false);
                    setPermissionArr([]);
                } else if (createModal) {
                    setDisableBtn(true);
                    const createUserObj = {
                        firstName: value.firstname,
                        lastName: value.lastname,
                        email: value.email,
                        password: value.password,
                        passwordConfirm: value.confirmPassword,
                    };
                    await axios.post(process.env.NEXT_PUBLIC_API_LINK + 'users/', createUserObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });
                    setDisableBtn(false);
                    setCreateModal(false);
                    action.resetForm();
                    setPermissionArr([]);
                }
            } catch (error: any) {
                setDisableBtn(true);
                if (typeof error?.response?.data?.message === 'object') {
                    setServerErrors(error?.response?.data?.message.join(' , '));
                } else {
                    setServerErrors(error?.response?.data?.message);
                }
                setServerErrors(error?.response?.data?.message);
                setDisableBtn(false);
            }
            setFetching(false);
        },
    });
    const handleClickSubmit = () => {
        errors && showAlert();
        if (serverErrors) {
            if (forceRender === false) {
                setForceRender(true);
            } else {
                setForceRender(false);
            }
        }
    };

    useEffect(() => {
        showServerAlert();
    }, [errors, serverErrors, forceRender]);

    useEffect(() => {}, [forceRender]);
    //server alerts
    const showServerAlert = () => {
        if (serverErrors) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: serverErrors,
                padding: '10px 20px',
            });
        }
        setServerErrors('');
    };

    //get single User by id
    const handleEditUser = (id: string): void => {
        setEditModal(true);
        const findUser: any = data?.find((item: UserDataType) => {
            return item.id === id;
        });
        setPermissionArr(findUser.permissions);
        setFieldValue('firstname', findUser.firstName);
        setFieldValue('lastname', findUser.lastName);
        setFieldValue('email', findUser.email);
        setSingleUserEdit(findUser);
    };

    //get all users list
    const getUsersList = async () => {
        try {
            setLoading(true);
            const res = await axios.get(process.env.NEXT_PUBLIC_API_LINK + 'users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            const users = res?.data?.data;
            setData(users);
            setLoading(false);
        } catch (error: any) {
            setLoading(true);
            if (typeof error?.response?.data?.message === 'object') {
                setServerErrors(error?.response?.data?.message.join(' , '));
            } else {
                setServerErrors(error?.response?.data?.message);
            }
            setServerErrors(error?.response?.data?.message);
            setLoading(false);
        }
    };

    const showAlert = async () => {
        if (errors.firstname) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.firstname,
                padding: '10px 20px',
            });
        } else if (errors.lastname) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.lastname,
                padding: '10px 20px',
            });
        } else if (errors.email) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.email,
                padding: '10px 20px',
            });
        } else if (errors.password) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.password,
                padding: '10px 20px',
            });
        } else if (errors.confirmPassword) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.confirmPassword,
                padding: '10px 20px',
            });
        }
    };

    //alert and server alert execution
    const handleDiscard = () => {
        setEditModal(false);
        setDeleteModal(false);
        setCreateModal(false);
        resetForm();
    };

    // get single user for view modal
    const handleViewUser = (id: string) => {
        setViewModal(true);
        const findUser: any | UserDataType = data?.find((item: UserDataType) => {
            return item.id === id;
        });
        setPermissionArr(findUser?.permissions);
        setSingleViewUser(findUser);
    };

    // delete user by id
    const handleDeleteUser = (id: string) => {
        setDeleteModal(true);
        const findUser = data?.find((item: UserDataType) => {
            return item.id === id;
        });
        setSingleDeleteUser(findUser?.id);
    };

    //get selected policy
    const handleSelectPolicy = (policies: any | SelectOptionsType, actionMeta: ActionMeta<any>) => {
        setDefaultSelectedPolicy(policies);
    };

    const onSubmitPolicy = async () => {
        setFetching(true);
        try {
            const selectedPolicyArr = defaultSelectedPolicy.map((policy: SelectOptionsType) => {
                return policy.value;
            });
            setDisableBtn(true);
            await axios.post(
                process.env.NEXT_PUBLIC_API_LINK + 'users/' + userPolicyId + '/policies',
                { policies: selectedPolicyArr },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                    },
                }
            );
            setDisableBtn(false);
            setPolicyModal(false);
        } catch (error: any) {
            setDisableBtn(true);
            if (typeof error?.response?.data?.message === 'object') {
                setServerErrors(error?.response?.data?.message.join(' , '));
            } else {
                setServerErrors(error?.response?.data?.message);
            }
            setServerErrors(error?.response?.data?.message);
            setDisableBtn(false);
        }
        setFetching(false);
    };

    const handlePolicy = async (id: string) => {
        setPolicyModal(true);
        setUserPolicyId(id);
        try {
            const res = await axios.get(process.env.NEXT_PUBLIC_API_LINK + 'policies/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            const policy = res?.data?.data;
            const createPolicyObj = policy.map((policy: PolicyDataType) => {
                return { value: policy.id, label: policy.name };
            });
            setPoliciesData(createPolicyObj);
            const findUser: any = data?.find((item: UserDataType) => {
                return item.id === id;
            });

            const selectedPolicyIdArr: string[] | any = findUser.policiesIncluded.map((item: any) => {
                return item.id;
            });
            const preSelectedPolicy: SelectOptionsType[] = createPolicyObj.filter((item: SelectOptionsType) => {
                return selectedPolicyIdArr.includes(item.value);
            });
            setDefaultSelectedPolicy(preSelectedPolicy);
        } catch (error: any) {
            if (typeof error?.response?.data?.message === 'object') {
                setServerErrors(error?.response?.data?.message.join(' , '));
            } else {
                setServerErrors(error?.response?.data?.message);
            }
            setServerErrors(error?.response?.data?.message);
        }
    };

    //deleting User
    const onDeleteUser = async () => {
        setFetching(true);
        try {
            setDisableBtn(true);
            await axios.delete(process.env.NEXT_PUBLIC_API_LINK + 'users/' + singleDeleteUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            setDisableBtn(false);
            setDeleteModal(false);
        } catch (error: any) {
            setDisableBtn(true);
            if (typeof error?.response?.data?.message === 'object') {
                setServerErrors(error?.response?.data?.message.join(' , '));
            } else {
                setServerErrors(error?.response?.data?.message);
            }
            setServerErrors(error?.response?.data?.message);
            setDisableBtn(false);
        }
        setFetching(false);
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
    const handleChangeActivateStatus = async (e: ChangeEvent<HTMLInputElement>, id: string) => {
        setDeactivateModal(true);
        setSingleDeactivateUserId(id);
        setDeactivateVal(e.target.checked);
    };
    const onDeactivateUser = async () => {
        setFetching(true);
        try {
            setDisableBtn(true);
            await axios.patch(
                process.env.NEXT_PUBLIC_API_LINK + 'users/' + singleDeactivateUserId + '/internal',
                { isActive: deactivateVal },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                    },
                }
            );
            setDisableBtn(false);
            setDeactivateModal(false);
        } catch (error: any) {
            setDisableBtn(true);
            if (typeof error?.response?.data?.message === 'object') {
                setServerErrors(error?.response?.data?.message.join(' , '));
            } else {
                setServerErrors(error?.response?.data?.message);
            }
            setServerErrors(error?.response?.data?.message);
            setDisableBtn(false);
        }
        setFetching(false);
    };
    return (
        <div>
            <PageHeadingSection description="Add, edit, or remove users. Assign roles. Track activity. Personalize user experience." heading="Manage Users" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                <div className="flex-1">
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => setCreateModal(true)}>
                        <Plus />
                        Add New User
                    </button>
                </div>
                <div className="relative  flex-1">
                    <input type="text" placeholder="Find A User" className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]" onChange={(e) => setSearchInputText(e.target.value)} value={searchQuery} />
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
                                            onChange={(e) => handleChangeActivateStatus(e, id)}
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
                                        <button type="button" onClick={() => handleViewUser(id)}>
                                            <View />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => handleEditUser(id)}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Policy">
                                        <button type="button" onClick={() => handlePolicy(id)}>
                                            <Shield />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => handleDeleteUser(id)}>
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

            <div className="mb-5">
                <Transition appear show={editModal} as={Fragment}>
                    <Dialog as="div" open={editModal} onClose={handleDiscard}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark sm:min-w-[35rem]">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Edit User</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div className="flex flex-col gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <label htmlFor="firstNameEdit">First Name</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.firstname}
                                                            id="firstNameEdit"
                                                            name="firstname"
                                                            type="text"
                                                            placeholder="First Name"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="lastNameEdit">Last Name</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.lastname}
                                                            id="lastNameEdit"
                                                            name="lastname"
                                                            type="text"
                                                            placeholder="Last Name"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleDiscard} disabled={disableBtn}>
                                                        Discard
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                                                        disabled={values.firstname && values.lastname && values.email && permissionArr.length !== 0 && !disableBtn ? false : true}
                                                        onClick={handleClickSubmit}
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

            {/* view modal */}

            <div className="mb-5">
                <Transition appear show={viewModal} as={Fragment}>
                    <Dialog as="div" open={viewModal} onClose={() => setViewModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark md:min-w-[37rem]">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">View user</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setViewModal(false)}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <ul className="flex flex-col gap-4">
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">First Name</span>
                                                    <p className="flex-[2]">{singleViewUser.firstName}</p>
                                                </li>
                                                <li className="flex">
                                                    <span className="flex-1 text-lg font-bold"> Last Name</span>
                                                    <p className="flex-[2]">{singleViewUser.lastName}</p>
                                                </li>
                                                <li className="flex">
                                                    <span className="flex-1 text-lg font-bold"> Email</span>
                                                    <p className="flex-[2] break-all">{singleViewUser.email}</p>
                                                </li>
                                                <li className="flex">
                                                    <span className="flex-1 text-lg font-bold">Permissions</span>
                                                    <div className="flex flex-[2] flex-wrap gap-x-2">
                                                        {permissionArr?.map((item: Permission, i: number) => {
                                                            return (
                                                                <span key={i} className="badge rounded-full bg-primary text-sm">
                                                                    {item.value}
                                                                </span>
                                                            );
                                                        })}
                                                        {permissionArr.length === 0 && <p>No permission given</p>}
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="mt-8 flex items-center justify-center">
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setViewModal(false)}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

            {/* delete modal */}

            <div className="mb-5">
                <Transition appear show={deleteModal} as={Fragment}>
                    <Dialog as="div" open={deleteModal} onClose={() => setDeleteModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Delete User</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setDeleteModal(false)}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <div className="text-center text-xl">
                                                Are you sure you want to delete this user? <br /> It will not revert!
                                            </div>
                                            <div className="mt-8 flex items-center justify-center">
                                                <button type="button" className="btn btn-outline-success" onClick={handleDiscard} disabled={disableBtn}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-danger ltr:ml-4 rtl:mr-4" onClick={onDeleteUser} disabled={disableBtn}>
                                                    Delete User
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

            {/* Deactivate modal */}

            <div className="mb-5">
                <Transition appear show={deactivateModal} as={Fragment}>
                    <Dialog as="div" open={deactivateModal} onClose={() => setDeactivateModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">{deactivateVal ? 'Activate' : 'Deactivate'} User</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setDeactivateModal(false)}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <div className="text-center text-xl">Are you sure you want to {deactivateVal ? 'activate' : 'deactivate'} this user?</div>
                                            <div className="mt-8 flex items-center justify-center">
                                                <button type="button" className={`btn btn-outline-${deactivateVal ? 'danger' : 'success'}`} onClick={handleDiscard} disabled={disableBtn}>
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn ${deactivateVal ? 'btn-success' : 'btn-danger'} rtl:mr-4" ltr:ml-4`}
                                                    onClick={onDeactivateUser}
                                                    disabled={disableBtn}
                                                >
                                                    {deactivateVal ? 'Activate' : 'Deactivate'} User
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

            {/* Policy modal */}
            <div className="mb-5">
                <Transition appear show={policyModal} as={Fragment}>
                    <Dialog as="div" open={policyModal} onClose={() => setPolicyModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60 ">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 min-h-[17rem] w-full max-w-lg overflow-visible rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">User Policy</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setPolicyModal(false)}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <div className="text-center text-xl">
                                                <Select placeholder="Select Policy" options={policiesData} isMulti isSearchable={false} onChange={handleSelectPolicy} value={defaultSelectedPolicy} />
                                            </div>
                                            <div className="mt-8 flex items-center justify-center">
                                                <button type="button" className={`btn btn-outline-danger`} onClick={handleDiscard} disabled={disableBtn}>
                                                    Cancel
                                                </button>
                                                <button type="button" className={`btn btn-success rtl:mr-4" ltr:ml-4`} onClick={onSubmitPolicy} disabled={disableBtn}>
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

            {/* create modal */}

            <div className="mb-5">
                <Transition appear show={createModal} as={Fragment}>
                    <Dialog as="div" open={createModal} onClose={handleDiscard}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark sm:min-w-[35rem]">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Create User</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div className="flex flex-col gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <label htmlFor="firstName">First Name</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.firstname}
                                                            id="firstName"
                                                            name="firstname"
                                                            type="text"
                                                            placeholder="First Name"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="lastName">Last Name</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.lastname}
                                                            id="lastName"
                                                            name="lastname"
                                                            type="text"
                                                            placeholder="Last Name"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.email}
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="Email"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <label htmlFor="password">Password</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.password}
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            placeholder="Password"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="confirmPassword">Confirm password</label>
                                                        <input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.confirmPassword}
                                                            id="confirmPassword"
                                                            name="confirmPassword"
                                                            type="password"
                                                            placeholder="confirmPassword"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                </div>
                                                {/* <p className="text-lg font-bold">Permissions</p>
                                                <div className="grid gap-y-1 sm:grid-cols-2 sm:gap-y-4">
                                                    {permission.map((item: Permission, i: number) => {
                                                        return (
                                                            <div key={i} className="flex gap-3">
                                                                <label className="relative h-6 w-12">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                                                        id="custom_switch_checkbox1"
                                                                        name="permission"
                                                                        onChange={(e) => handleCreatePermission(e, item.key)}
                                                                    />
                                                                    <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                                                                </label>
                                                                <span>{item.value}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div> */}
                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleDiscard}>
                                                        Discard
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                                                        disabled={values.firstname && values.lastname && values.email && values.password && values.confirmPassword && !disableBtn ? false : true}
                                                        onClick={handleClickSubmit}
                                                    >
                                                        Create User
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default Users;

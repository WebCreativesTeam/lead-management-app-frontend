/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import { policyEditSchema } from '@/utils/schemas';
import Swal from 'sweetalert2';
import usePermission from '@/utils/Hooks/usePermissions';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Close, Delete, Edit, Plus, SnackLine, View, WalkingMan } from '@/components/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';

type PolicyDataType = {
    name: string;
    id: string;
    description: string;
    permissions: string[];
};

type Permission = {
    key: string;
    value: string;
};

const PolicyPage = () => {
    //hooks
    const [data, setData] = useState<PolicyDataType[]>([]);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [viewModal, setViewModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [singlePolicy, setSinglePolicy] = useState<any>({});
    const [singleViewPolicy, setSingleViewPolicy] = useState<any>({});
    const [singleDeletePolicy, setSingleDeletePolicy] = useState<any>('');
    const [disableBtn, setDisableBtn] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState('');
    const [forceRender, setForceRender] = useState<boolean>(false);
    const [permissionArr, setPermissionArr] = useState<string[]>([]);
    const [viewPermissionArr, setViewPermissionArr] = useState<Permission[]>([]);
    const [searchPolicyText, setSearchPolicyText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<PolicyDataType[]>(data);
    const permission: Permission[] = usePermission();
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

    //get all policy after page render
    useEffect(() => {
        getPolicyList();
    }, [fetching]);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    // set initialValues when open modal
    const initialValues = {
        policyName: '',
        policyDescription: '',
    };

    //useDefferedValue hook for search query

    const searchQuery = useDeferredValue(searchPolicyText);

    //form handling
    const { values, handleChange, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: policyEditSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            setFetching(true);
            try {
                if (editModal) {
                    setDisableBtn(true);
                    const editPolicyObj = {
                        name: value.policyName,
                        description: value.policyDescription,
                        permissions: singlePolicy.permissions,
                    };
                    await axios.patch(process.env.NEXT_PUBLIC_API_LINK + 'policies/' + singlePolicy.id, editPolicyObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });
                    setDisableBtn(false);
                    action.resetForm();
                    setEditModal(false);
                    setPermissionArr([]);
                } else if (createModal) {
                    const createPolicyObj = {
                        name: value.policyName,
                        description: value.policyDescription,
                        permissions: permissionArr,
                    };

                    await axios.post(process.env.NEXT_PUBLIC_API_LINK + 'policies/', createPolicyObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });

                    setDisableBtn(true);
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
    useEffect(() => {
        showServerAlert();
    }, [errors, serverErrors, forceRender]);

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

    //get single policy by id

    const handleEditPolicy = (id: string): void => {
        setEditModal(true);
        const findPolicy: any = data?.find((item: PolicyDataType) => {
            return item.id === id;
        });
        setPermissionArr(findPolicy.permissions);
        setFieldValue('policyName', findPolicy?.name);
        setFieldValue('policyDescription', findPolicy?.description);
        setSinglePolicy(findPolicy);
    };

    //get all policy list

    const getPolicyList = async () => {
        try {
            setLoading(true);
            const res = await axios.get(process.env.NEXT_PUBLIC_API_LINK + 'policies?sort=-isDefault', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            const policy = res?.data?.data;
            setData(policy);
            setLoading(false);
        } catch (error: any) {
            if (typeof error?.response?.data?.message === 'object') {
                setServerErrors(error?.response?.data?.message.join(' , '));
            } else {
                setServerErrors(error?.response?.data?.message);
            }
            setServerErrors(error?.response?.data?.message);
        }
    };

    const showAlert = async () => {
        if (errors.policyName) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.policyName,
                padding: '10px 20px',
            });
        } else if (errors.policyDescription) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.policyDescription,
                padding: '10px 20px',
            });
        }
    };

    //alert and server alert execution

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

    const handleDiscard = () => {
        setEditModal(false);
        setDeleteModal(false);
        setCreateModal(false);
        resetForm();
    };

    // get single policy for view modal

    const handleViewPolicy = (id: string) => {
        setViewModal(true);
        const findPolicy = data?.find((item: PolicyDataType) => {
            return item.id === id;
        });
        const tempArray: Permission[] = permission?.filter((item) => {
            return findPolicy?.permissions.includes(item.key);
        });
        setViewPermissionArr(tempArray);
        setSingleViewPolicy(findPolicy);
    };

    // delete policy by id

    const handleDeletePolicy = (id: string) => {
        setDeleteModal(true);
        const findPolicy = data?.find((item: PolicyDataType) => {
            return item.id === id;
        });
        setSingleDeletePolicy(findPolicy?.id);
    };

    useEffect(() => {}, [forceRender]);

    //creating permission array
    const handleCreatePermission = (e: any, key: string) => {
        if (e.target.checked) {
            permissionArr.push(key);
        } else {
            const index = permissionArr.indexOf(key);
            if (index > -1) {
                permissionArr.splice(index, 1);
            }
        }
        //force render component because not updating state
        if (forceRender === true) {
            setForceRender(false);
        } else {
            setForceRender(true);
        }
    };

    //editing permission array
    const handleEditPermission = (e: any, key: string) => {
        if (e.target.checked) {
            permissionArr.push(key);
        } else {
            const index = permissionArr.indexOf(key);
            if (index > -1) {
                permissionArr.splice(index, 1);
            }
        }
        //force render component because not updating state
        if (forceRender === true) {
            setForceRender(false);
        } else {
            setForceRender(true);
        }
    };

    //deleting policy
    const onDeletePolicy = async () => {
        setFetching(true);
        try {
            setDisableBtn(true);
            await axios.delete(process.env.NEXT_PUBLIC_API_LINK + 'policies/' + singleDeletePolicy, {
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
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => setCreateModal(true)}>
                        <Plus />
                        Add New Policy
                    </button>
                </div>
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find A Policy"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchPolicyText(e.target.value)}
                        value={searchQuery}
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
                            accessor: 'action',
                            title: 'Actions',
                            titleClassName: '!text-center',
                            render: ({ id }) => (
                                <div className="flex justify-center gap-2  p-3 text-center ">
                                    <Tippy content="View">
                                        <button type="button" onClick={() => handleViewPolicy(id)}>
                                            <View />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => handleEditPolicy(id)}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => handleDeletePolicy(id)}>
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
                                            <h5 className="text-lg font-bold">Edit Policy</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div>
                                                    <label htmlFor="policyNameEdit">Policy Name</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.policyName}
                                                        id="policyNameEdit"
                                                        name="policyName"
                                                        type="text"
                                                        placeholder="Policy Name"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="policyDescriptionEdit">Policy Description</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.policyDescription}
                                                        id="policyDescriptionEdit"
                                                        name="policyDescription"
                                                        type="text"
                                                        placeholder="Policy Description"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <p className="text-lg font-bold">Permissions</p>
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
                                                                        defaultChecked={permissionArr.includes(item.key) ? true : false}
                                                                        onChange={(e) => handleEditPermission(e, item.key)}
                                                                    />
                                                                    <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                                                                </label>
                                                                <span>{item.value}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleDiscard}>
                                                        Discard
                                                    </button>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                                                        value={'Save Changes'}
                                                        onClick={handleClickSubmit}
                                                        disabled={values.policyName && values.policyDescription && !disableBtn && permissionArr.length !== 0 ? false : true}
                                                    />
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
                                            <h5 className="text-lg font-bold">View policy</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setViewModal(false)}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <ul className="flex flex-col gap-4">
                                                <li className="flex gap-16">
                                                    <span className="text-lg font-bold">Name</span>
                                                    <p>{singleViewPolicy.name}</p>
                                                </li>
                                                <li className="flex gap-4">
                                                    <span className="text-lg font-bold"> Description</span>
                                                    <p>{singleViewPolicy.description}</p>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-lg font-bold">Permissions</span>
                                                    <div className="flex flex-wrap gap-x-2">
                                                        {viewPermissionArr?.map((item: Permission, i: number) => {
                                                            return (
                                                                <span key={i} className="badge rounded-full bg-primary text-sm">
                                                                    {item.value}
                                                                </span>
                                                            );
                                                        })}
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
                                            <h5 className="text-lg font-bold">Delete policy</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setDeleteModal(false)}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <div className="text-center text-xl">
                                                Are you sure you want to delete this policy? <br /> It will not revert!
                                            </div>
                                            <div className="mt-8 flex items-center justify-center">
                                                <button type="button" className="btn btn-outline-success" onClick={handleDiscard} disabled={disableBtn}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-danger ltr:ml-4 rtl:mr-4" onClick={onDeletePolicy} disabled={disableBtn}>
                                                    Delete Policy
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
                                            <h5 className="text-lg font-bold">Create Policy</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div>
                                                    <label htmlFor="policyNameEdit">Policy Name</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.policyName}
                                                        id="policyNameEdit"
                                                        name="policyName"
                                                        type="text"
                                                        placeholder="Policy Name"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="policyDescriptionEdit">Policy Description</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.policyDescription}
                                                        id="policyDescriptionEdit"
                                                        name="policyDescription"
                                                        type="text"
                                                        placeholder="Policy Description"
                                                        className="form-input"
                                                    />
                                                </div>

                                                <p className="text-lg font-bold">Permissions</p>
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
                                                </div>
                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleDiscard}>
                                                        Discard
                                                    </button>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                                                        value="Create Policy"
                                                        disabled={values.policyName && values.policyDescription && !disableBtn && permissionArr.length !== 0 ? false : true}
                                                    />
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

export default PolicyPage;

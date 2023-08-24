/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import { branchSchema } from '@/utils/schemas';
import Swal from 'sweetalert2';
import Select, { ActionMeta } from 'react-select';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Close, Delete, Edit, Plus, SnackLine, View, WalkingMan } from '@/components/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { BranchDataType, SelectOptionsType } from '@/utils/Types';
import { countryData } from '@/utils/Raw Data';

type SelectAddress = {
    country: SelectOptionsType;
    state: SelectOptionsType;
    city: SelectOptionsType;
};
const BranchPage = () => {

     const dispatch = useDispatch();
     useEffect(() => {
         dispatch(setPageTitle('Organize Offices | Branches'));
     });

    //hooks
    const [data, setData] = useState<BranchDataType[]>([]);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [viewModal, setViewModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [singleBranch, setSingleBranch] = useState<any>({});
    const [singleViewBranch, setSingleViewBranch] = useState<any>({});
    const [singleDeleteBranch, setSingleDeleteBranch] = useState<any>('');
    const [disableBtn, setDisableBtn] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState('');
    const [forceRender, setForceRender] = useState<boolean>(false);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [selectAddress, setSelectAddress] = useState<SelectAddress>({
        country: {
            value: '',
            label: '',
        },
        state: {
            value: '',
            label: '',
        },
        city: {
            value: '',
            label: '',
        },
    });
    const [searchedData, setSearchedData] = useState<BranchDataType[]>(data);
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

    //get all branch after page render
    useEffect(() => {
        getBranchList();
    }, [fetching]);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    // set initialValues when open modal
    const initialValues = {
        name: '',
        address: '',
    };

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    //form handling
    const { values, handleChange, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: branchSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            try {
                setFetching(true);
                if (editModal) {
                    setDisableBtn(true);
                    const editBranchObj = {
                        name: value.name,
                        address: value.address,
                        city: selectAddress.city.value,
                        state: selectAddress.state.value,
                        country: selectAddress.country.value,
                    };
                    await axios.patch(process.env.NEXT_PUBLIC_API_LINK + 'branches/' + singleBranch.id, editBranchObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });
                    setDisableBtn(false);
                    action.resetForm();
                    setEditModal(false);
                } else if (createModal) {
                    setDisableBtn(true);
                    const createBranchObj = {
                        name: value.name,
                        address: value.address,
                        city: selectAddress.city.value,
                        state: selectAddress.state.value,
                        country: selectAddress.country.value,
                    };
                    await axios.post(process.env.NEXT_PUBLIC_API_LINK + 'branches/', createBranchObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });
                    setDisableBtn(false);
                    setCreateModal(false);
                    setSelectAddress({
                        country: {
                            value: '',
                            label: '',
                        },
                        state: {
                            value: '',
                            label: '',
                        },
                        city: {
                            value: '',
                            label: '',
                        },
                    });
                    action.resetForm();
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

    //get single branch by id
    const handleEditBranch = (id: string): void => {
        setEditModal(true);
        const findBranch: any = data?.find((item: BranchDataType) => {
            return item.id === id;
        });
        setFieldValue('name', findBranch?.name);
        setFieldValue('address', findBranch?.address);
        setSingleBranch(findBranch);
        const existingCountry: any = countryData.find((item) => {
            return item.value === findBranch.country;
        });
        const existingState: any = countryData.find((item) => {
            return item.value === findBranch.state;
        });
        const existingCity: any = countryData.find((item) => {
            return item.value === findBranch.city;
        });
        setSelectAddress({
            country: existingCountry,
            state: existingState,
            city: existingCity,
        });
    };

    //get all Branch list
    const getBranchList = async () => {
        try {
            setLoading(true);
            const res = await axios.get(process.env.NEXT_PUBLIC_API_LINK + 'branches/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            const branches = res?.data?.data;
            setData(branches);
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

    //showing validation error
    const showAlert = async () => {
        if (errors.address) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.address,
                padding: '10px 20px',
            });
        } else if (errors.name) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: errors.name,
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
        setSelectAddress({
            country: {
                value: '',
                label: '',
            },
            state: {
                value: '',
                label: '',
            },
            city: {
                value: '',
                label: '',
            },
        });
        resetForm();
    };

    // get single branch for view modal
    const handleViewBranch = (id: string) => {
        setViewModal(true);
        const findBranch = data?.find((item: BranchDataType) => {
            return item.id === id;
        });
        setSingleViewBranch(findBranch);
    };

    // delete branch by id

    const handleDeleteBranch = (id: string) => {
        setDeleteModal(true);
        const findBranch = data?.find((item: BranchDataType) => {
            return item.id === id;
        });
        setSingleDeleteBranch(findBranch?.id);
    };

    //deleting branch
    const onDeleteBranch = async () => {
        setFetching(true);
        try {
            setDisableBtn(true);
            await axios.delete(process.env.NEXT_PUBLIC_API_LINK + 'branches/' + singleDeleteBranch, {
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

    //search branch
    const handleSearchBranch = () => {
        const searchBranchData = data?.filter((branch: BranchDataType) => {
            return (
                branch.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                branch.name.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                branch.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchBranchData);
        setRecordsData(searchBranchData);
    };

    //select country
    const handleSelectCountry = (country: any | SelectOptionsType, actionMeta: ActionMeta<any>) => {
        setSelectAddress((preVal) => {
            return { ...preVal, country };
        });
    };

    //select state
    const handleSelectState = (state: any | SelectOptionsType, actionMeta: ActionMeta<any>) => {
        setSelectAddress((preVal) => {
            return { ...preVal, state };
        });
    };

    //select  city
    const handleSelectCity = (city: any | SelectOptionsType, actionMeta: ActionMeta<any>) => {
        setSelectAddress((preVal) => {
            return { ...preVal, city };
        });
    };
    return (
        <div>
            <PageHeadingSection description="List company branches. Add new locations. Update details. Remove obsolete branches." heading="Organize Offices" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                <div className="flex-1">
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => setCreateModal(true)}>
                        <Plus />
                        Add New Branch
                    </button>
                </div>
                <div className="relative  flex-1">
                    <input type="text" placeholder="Find A Branch" className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]" onChange={(e) => setSearchInputText(e.target.value)} value={searchQuery} />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={handleSearchBranch}>
                        Search
                    </button>
                </div>
            </div>
            {/* Branch List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    fetching={loading}
                    columns={[
                        {
                            accessor: 'name',
                            title: 'Branch Name',
                            sortable: true,
                            render: ({ name }) => <div>{name}</div>,
                        },
                        {
                            accessor: 'country',
                            title: 'Country',
                            sortable: true,
                            render: ({ country }) => <div>{country}</div>,
                        },
                        {
                            accessor: 'state',
                            title: 'State',
                            sortable: true,
                            render: ({ state }) => <div>{state}</div>,
                        },
                        {
                            accessor: 'city',
                            title: 'City',
                            sortable: true,
                            render: ({ city }) => <div>{city}</div>,
                        },
                        {
                            accessor: 'action',
                            title: 'Action',
                            titleClassName: '!text-center',
                            render: ({ id }) => (
                                <div className="flex justify-center gap-2 p-3 text-center">
                                    <Tippy content="View">
                                        <button type="button" onClick={() => handleViewBranch(id)}>
                                            <View />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => handleEditBranch(id)}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => handleDeleteBranch(id)}>
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
                            <div className="flex min-h-screen items-center justify-center px-4 ">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg  overflow-visible rounded-lg border-0 p-0 text-black dark:text-white-dark sm:min-w-[40rem]">
                                        <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Edit Branch</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div>
                                                    <label htmlFor="createBranch">Branch Name</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="createBranch"
                                                        name="name"
                                                        type="text"
                                                        placeholder="Branch Name"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="createAddress">Address</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.address}
                                                        id="createAddress"
                                                        name="address"
                                                        type="text"
                                                        placeholder="Branch Address"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <section className="flex flex-col  gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <label htmlFor="country">Select Country</label>
                                                        <Select placeholder="Select Country" options={countryData} id="country" onChange={handleSelectCountry} defaultValue={selectAddress.country} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="state">Select State</label>
                                                        <Select placeholder="Select State" options={countryData} onChange={handleSelectState} defaultValue={selectAddress.state} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="state">Select City</label>
                                                        <Select placeholder="Select City" options={countryData} onChange={handleSelectCity} defaultValue={selectAddress.city} />
                                                    </div>
                                                </section>
                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" disabled={disableBtn} onClick={handleDiscard}>
                                                        Discard
                                                    </button>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                                                        value="Edit Branch"
                                                        disabled={values.name && selectAddress.state && selectAddress.country && selectAddress.city && values.address && !disableBtn ? false : true}
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
                                            <h5 className="text-lg font-bold">View Branch</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setViewModal(false)}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <ul className="flex flex-col gap-4">
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Branch Name</span>
                                                    <p className="flex-[2]">{singleViewBranch.name}</p>
                                                </li>
                                                <li className="flex">
                                                    <span className="flex-1 text-lg font-bold"> Country</span>
                                                    <p className="flex-[2]">{singleViewBranch.country}</p>
                                                </li>
                                                <li className="flex">
                                                    <span className="flex-1 text-lg font-bold"> State</span>
                                                    <p className="flex-[2]">{singleViewBranch.state}</p>
                                                </li>
                                                <li className="flex">
                                                    <span className="flex-1 text-lg font-bold"> City</span>
                                                    <p className="flex-[2]">{singleViewBranch.city}</p>
                                                </li>
                                                <li className="flex">
                                                    <span className="flex-1 text-lg font-bold"> Address</span>
                                                    <p className="flex-[2]">{singleViewBranch.address}</p>
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
            <ConfirmationModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                onDiscard={() => setDeleteModal(false)}
                description={<>Are you sure you want to delete this Branch? It will also remove form database.</>}
                title="Delete task priority"
                isBtnDisabled={disableBtn}
                onSubmit={onDeleteBranch}
                btnSubmitText="Delete"
            />
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
                            <div className="flex min-h-screen items-center justify-center px-4 ">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg  overflow-visible rounded-lg border-0 p-0 text-black dark:text-white-dark sm:min-w-[40rem]">
                                        <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Create Branch</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div>
                                                    <label htmlFor="createBranch">Branch Name</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="createBranch"
                                                        name="name"
                                                        type="text"
                                                        placeholder="Branch Name"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="createAddress">Address</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.address}
                                                        id="createAddress"
                                                        name="address"
                                                        type="text"
                                                        placeholder="Branch Address"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <section className="flex flex-col  gap-4 sm:flex-row">
                                                    <div className="flex-1">
                                                        <label htmlFor="country">Select Country</label>
                                                        <Select placeholder="Select Country" options={countryData} id="country" onChange={handleSelectCountry} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="state">Select State</label>
                                                        <Select placeholder="Select State" options={countryData} onChange={handleSelectState} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label htmlFor="state">Select City</label>
                                                        <Select placeholder="Select City" options={countryData} onChange={handleSelectCity} />
                                                    </div>
                                                </section>
                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" disabled={disableBtn} onClick={handleDiscard}>
                                                        Discard
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                                                        onClick={handleClickSubmit}
                                                        disabled={
                                                            values.name && selectAddress.state.value && selectAddress.country.value && selectAddress.city.value && values.address && !disableBtn
                                                                ? false
                                                                : true
                                                        }
                                                    >
                                                        Create Branch
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

export default BranchPage;

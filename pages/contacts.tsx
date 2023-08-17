/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import { contactSchema } from '@/utils/schemas';
import Swal from 'sweetalert2';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Close, Delete, Edit, Plus, View, WalkingMan } from '@/components/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { ContactDataType } from '@/utils/Types';

const Contacts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Track Leads | Contacts'));
    });

    //hooks
    const [data, setData] = useState<ContactDataType[]>([]);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [viewModal, setViewModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [singleContact, setSingleContact] = useState<any>({});
    const [singleViewContact, setSingleViewContact] = useState<any>({});
    const [singleDeleteContact, setSingleDeleteContact] = useState<any>('');
    const [disableBtn, setDisableBtn] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState('');
    const [forceRender, setForceRender] = useState<boolean>(false);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<ContactDataType[]>(data);
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

    //get all contact after page render
    useEffect(() => {
        getContactList();
    }, [fetching]);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    // set initialValues when open modal
    const initialValues = {
        name: '',
    };

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    //form handling
    const { values, handleChange, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: contactSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            setFetching(true);
            try {
                if (editModal) {
                    setDisableBtn(true);
                    const editContactObj = {
                        name: value.name,
                    };
                    await axios.patch(process.env.NEXT_PUBLIC_API_LINK + 'Contacts/' + singleContact.id, editContactObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });
                    setDisableBtn(false);
                    action.resetForm();
                    setEditModal(false);
                } else if (createModal) {
                    setDisableBtn(true);
                    const createContactObj = {
                        name: value.name,
                    };
                    await axios.post(process.env.NEXT_PUBLIC_API_LINK + 'contacts/', createContactObj, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                        },
                    });
                    setDisableBtn(false);
                    setCreateModal(false);
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

    //get single contact by id
    const handleEditContact = (id: string): void => {
        setEditModal(true);
        const findContact: any = data?.find((item: ContactDataType) => {
            return item.id === id;
        });
        setFieldValue('name', findContact?.name);
        setSingleContact(findContact);
    };

    //get all Contact list
    const getContactList = async () => {
        try {
            setLoading(true);
            const res = await axios.get(process.env.NEXT_PUBLIC_API_LINK + 'Contacts/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            const contacts = res?.data?.data;
            setData(contacts);
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
        if (errors.name) {
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
        resetForm();
    };

    // get single contact for view modal
    const handleViewContact = (id: string) => {
        setViewModal(true);
        const findContact = data?.find((item: ContactDataType) => {
            return item.id === id;
        });
        setSingleViewContact(findContact);
    };

    // delete contact by id

    const handleDeleteContact = (id: string) => {
        setDeleteModal(true);
        const findContact = data?.find((item: ContactDataType) => {
            return item.id === id;
        });
        setSingleDeleteContact(findContact?.id);
    };

    //deleting contact
    const onDeleteContact = async () => {
        setFetching(true);
        try {
            setDisableBtn(true);
            await axios.delete(process.env.NEXT_PUBLIC_API_LINK + 'contacts/' + singleDeleteContact, {
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

    //search contact
    const handleSearchContact = () => {
        const searchContactData = data?.filter((contact: ContactDataType) => {
            return (
                contact.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                contact.name.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                contact.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchContactData);
        setRecordsData(searchedData);
    };

    return (
        <div>
            <PageHeadingSection description="Identify and categorize lead contacts. Update descriptions. Add or remove contact channels." heading="Track Leads" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                <div className="flex-1">
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => setCreateModal(true)}>
                        <Plus />
                        Add New Contact
                    </button>
                </div>
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find A Contact"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchQuery}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={handleSearchContact}>
                        Search
                    </button>
                </div>
            </div>

            {/* contact List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'name',
                            title: 'Name',
                            sortable: true,
                            render: ({ name, title }) => <div>{`${title} ${name}`}</div>,
                        },
                        {
                            accessor: 'phoneNumber',
                            title: 'Phone No',
                            sortable: true,
                            render: ({ phoneNumber }) => <div>{phoneNumber}</div>,
                        },
                        {
                            accessor: 'email',
                            title: 'Email',
                            sortable: true,
                            render: ({ email }) => <div>{email}</div>,
                        },
                        {
                            accessor: 'position',
                            title: 'Position',
                            sortable: true,
                            render: ({ position }) => <div>{position}</div>,
                        },
                        {
                            accessor: 'industry',
                            title: 'Industry',
                            sortable: true,
                            render: ({ industry }) => <div>{industry}</div>,
                        },
                        {
                            accessor: 'location',
                            title: 'City',
                            sortable: true,
                            render: ({ location }) => <div>{location.city}</div>,
                        },
                        {
                            accessor: 'location',
                            title: 'State',
                            sortable: true,
                            render: ({ location }) => <div>{location.state}</div>,
                        },
                        {
                            accessor: 'location',
                            title: 'Country',
                            sortable: true,
                            render: ({ location }) => <div>{location.country}</div>,
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
                            accessor: 'action',
                            title: 'Actions',
                            titleClassName: '!text-center',
                            render: ({ id }) => (
                                <div className="flex justify-center gap-2  p-3 text-center ">
                                    <Tippy content="View">
                                        <button type="button" onClick={() => handleViewContact(id)}>
                                            <View />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => handleEditContact(id)}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => handleDeleteContact(id)}>
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
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg  overflow-visible rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Edit Contact</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div>
                                                    <label htmlFor="createContact">Contact Name</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="createContact"
                                                        name="name"
                                                        type="text"
                                                        placeholder="Contact Name"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleDiscard} disabled={disableBtn}>
                                                        Discard
                                                    </button>
                                                    <button type="submit" className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4" disabled={values.name && !disableBtn ? false : true}>
                                                        Edit Contact
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
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">View Contact</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setViewModal(false)}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <ul className="flex flex-col gap-4">
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Contact Name</span>
                                                    <p className="flex-[2]">{singleViewContact.name}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Contact Created</span>
                                                    <p className="flex-[2]">{new Date(singleViewContact.createdAt).toLocaleString()}</p>
                                                </li>
                                                <li className="flex flex-wrap">
                                                    <span className="flex-1 text-lg font-bold">Last Updated</span>
                                                    <p className="flex-[2]">{new Date(singleViewContact.updatedAt).toLocaleString()}</p>
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
                description={<>Are you sure you want to delete this Contact? It will also remove form database.</>}
                title="Delete task priority"
                isBtnDisabled={disableBtn}
                onSubmit={onDeleteContact}
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
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg  overflow-visible rounded-lg border-0 p-0 text-black dark:text-white-dark ">
                                        <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Create Contact</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={handleDiscard}>
                                                <Close />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div>
                                                    <label htmlFor="createContact">Contact Name</label>
                                                    <input
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        id="createContact"
                                                        name="name"
                                                        type="text"
                                                        placeholder="Contact Name"
                                                        className="form-input"
                                                    />
                                                </div>

                                                <div className="mt-8 flex items-center justify-end">
                                                    <button type="button" className="btn btn-outline-danger" onClick={handleDiscard} disabled={disableBtn}>
                                                        Discard
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                                                        onClick={handleClickSubmit}
                                                        disabled={values.name && !disableBtn ? false : true}
                                                    >
                                                        Create Contact
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

export default Contacts;

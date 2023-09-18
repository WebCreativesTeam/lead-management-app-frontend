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
import { ContactDataType, GetMethodResponseType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { getAllContacts, setEditModal, setDeleteModal, setCreateModal, setViewModal, setFetching, setDisableBtn } from '@/store/Slices/contactSlice';
import ContactViewModal from '@/components/Contact/ContactViewModal';
import { IRootState } from '@/store';
import ContactCreateModal from '@/components/Contact/ContactCreateModal';
import ContactEditModal from '@/components/Contact/ContactEditModal';
import { useRouter } from 'next/router';
import Loader from '@/components/__Shared/Loader';

const Contacts = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
    });
    //hooks
    const { data, isFetching, isBtnDisabled, deleteModal, singleData, isAbleToCreate, isAbleToDelete, isAbleToUpdate, isAbleToRead, userPolicyArr } = useSelector(
        (state: IRootState) => state.contacts
    );
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<ContactDataType[]>(data);
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

    //router user if dont have permission to access branch page
    useEffect(() => {
        if (!isAbleToRead && userPolicyArr.length > 0) {
            router.push('/');
            return;
        }
    }, []);

    //get all contact after page render
    useEffect(() => {
        getContactList();
    }, [isFetching]);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    // useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    //get all Contact list
    const getContactList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('contact');
        const contacts: ContactDataType[] = res?.data;
        if (typeof contacts === 'undefined') {
            dispatch(getAllContacts([] as ContactDataType[]));
            return;
        }
        dispatch(getAllContacts(contacts));
        setLoading(false);
    };

    //deleting contact
    const onDeleteContact = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteContact: ContactDataType = await new ApiClient().delete('contact/' + singleData.id);
        if (deleteContact === null) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setFetching(false));
        dispatch(setDeleteModal({ open: false }));
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
        setRecordsData(searchContactData);
    };

    return !isAbleToRead ? null : (
        <div>
            <PageHeadingSection description="Identify and categorize lead contacts. Update descriptions. Add or remove contact channels." heading="Track Leads" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Add New Contact
                        </button>
                    </div>
                )}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find A Contact"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
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
                            accessor: 'city',
                            title: 'City',
                            sortable: true,
                            render: ({ location }) => <div>{location.city}</div>,
                        },
                        {
                            accessor: 'state',
                            title: 'State',
                            sortable: true,
                            render: ({ location }) => <div>{location.state}</div>,
                        },
                        {
                            accessor: 'country',
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
                    totalRecords={initialRecords?.length}
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
            <ContactEditModal />

            {/* view modal */}
            <ContactViewModal />

            {/* delete modal */}
            <ConfirmationModal
                open={deleteModal}
                onClose={() => dispatch(setDeleteModal({ open: false }))}
                onDiscard={() => dispatch(setDeleteModal({ open: false }))}
                description={isFetching ? <Loader /> : <>Are you sure you want to delete this Contact? It will also remove form database.</>}
                title="Delete Contact"
                isBtnDisabled={isBtnDisabled}
                onSubmit={onDeleteContact}
                btnSubmitText="Delete"
            />

            {/* create modal */}
            <ContactCreateModal />
        </div>
    );
};

export default Contacts;

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
import { ContactDataType, GetMethodResponseType, SourceDataType, UserListSecondaryEndpointType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import {
    getAllContacts,
    setEditModal,
    setDeleteModal,
    setCreateModal,
    setViewModal,
    getAllUsersForContact,
    getAllSourceForContact,
    setContactDataLength,
} from '@/store/Slices/contactSlice';
import ContactViewModal from '@/components/Contact/ContactViewModal';
import { IRootState } from '@/store';
import ContactCreateModal from '@/components/Contact/ContactCreateModal';
import ContactEditModal from '@/components/Contact/ContactEditModal';
import ContactDeleteModal from '@/components/Contact/ContactDeleteModal';

const Contacts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
    });
    //hooks
    const { data, isFetching, isBtnDisabled, deleteModal, singleData, isAbleToCreate, isAbleToDelete, isAbleToUpdate, isAbleToRead, totalRecords } = useSelector((state: IRootState) => state.contacts);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');

    const [recordsData, setRecordsData] = useState<ContactDataType[]>([] as ContactDataType[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    // useDefferedValue hook for search query
    const searchQuery = useDeferredValue(search);

    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    //get all contact after page render
    useEffect(() => {
        getContactList();
        getAllSourceList();
        getAllUsersList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all Contact list
    const getContactList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`contact?search=${searchQuery}&limit=${pageSize}&page=${page}`);
        const contacts: ContactDataType[] = res?.data;
        if (typeof contacts === 'undefined') {
            dispatch(getAllContacts([] as ContactDataType[]));
            return;
        }
        dispatch(getAllContacts(contacts));
        dispatch(setContactDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    //get all user's list
    const getAllUsersList = async () => {
        setLoading(true);
        const usersList: GetMethodResponseType = await new ApiClient().get('user/list');
        const users: UserListSecondaryEndpointType[] = usersList?.data;
        if (typeof users === 'undefined') {
            dispatch(getAllUsersForContact([] as UserListSecondaryEndpointType[]));
            return;
        }
        dispatch(getAllUsersForContact(users));
    };

    //get all Source list
    const getAllSourceList = async () => {
        setLoading(true);
        const sourceList: GetMethodResponseType = await new ApiClient().get('source/list');
        const source: SourceDataType[] = sourceList?.data;
        if (typeof source === 'undefined') {
            dispatch(getAllSourceForContact([] as SourceDataType[]));
            return;
        }
        dispatch(getAllSourceForContact(source));
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
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
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
                            render: ({ location }) => <div>{location?.city}</div>,
                        },
                        {
                            accessor: 'state',
                            title: 'State',
                            sortable: true,
                            render: ({ location }) => <div>{location?.state}</div>,
                        },
                        {
                            accessor: 'country',
                            title: 'Country',
                            sortable: true,
                            render: ({ location }) => <div>{location?.country}</div>,
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
            <ContactEditModal />

            {/* view modal */}
            <ContactViewModal />

            {/* delete modal */}
            <ContactDeleteModal />

            {/* create modal */}
            <ContactCreateModal />
        </div>
    );
};

export default Contacts;

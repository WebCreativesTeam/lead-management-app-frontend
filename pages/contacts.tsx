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
    setPage,
    setPageSize,
} from '@/store/Slices/contactSlice';
import ContactViewModal from '@/components/Contact/ContactViewModal';
import { IRootState } from '@/store';
import ContactCreateModal from '@/components/Contact/ContactCreateModal';
import ContactEditModal from '@/components/Contact/ContactEditModal';
import ContactDeleteModal from '@/components/Contact/ContactDeleteModal';
import Dropdown from '@/components/Dropdown';
import { PAGE_SIZES } from '@/utils/contant';

const Contacts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
    });
    //hooks
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToUpdate, isAbleToRead, totalRecords, viewModal, deleteModal, createModal, pageSize, page } = useSelector(
        (state: IRootState) => state.contacts
    );
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    //datatable

    const [search, setSearch] = useState<string>('');
    const [hideCols, setHideCols] = useState<string[]>(['contactTitle']);

    const [recordsData, setRecordsData] = useState<ContactDataType[]>([] as ContactDataType[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    // useDefferedValue hook for search query
    const searchQuery = useDeferredValue(search);

    const cols: { accessor: string; title: string }[] = [
        { accessor: 'name', title: 'Name' },
        { accessor: 'phoneNumber', title: 'Phone No' },
        { accessor: 'email', title: 'Email' },
        { accessor: 'position', title: 'Position' },
        { accessor: 'industry', title: 'Industry' },
        { accessor: 'anniversary', title: ' Wedding Anniversary' },
        { accessor: 'DOB', title: 'Date Of Birth' },
        { accessor: 'altPhoneNumber', title: 'Alternative Phone Number' },
        { accessor: 'city', title: 'City' },
        { accessor: 'state', title: 'State' },
        { accessor: 'country', title: 'Country' },
        { accessor: 'createdAt', title: 'Created Date' },
        { accessor: 'updatedAt', title: 'Last Updated' },
    ];

    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        dispatch(setPage(1));
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

    const showHideColumns = (col: string) => {
        if (hideCols.includes(col)) {
            setHideCols((col: any) => hideCols.filter((d: any) => d !== col));
        } else {
            setHideCols([...hideCols, col]);
        }
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
            <div className="flex justify-start gap-4">
                <div className="dropdown">
                    <Dropdown
                        placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                        btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                        button={
                            <>
                                <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        }
                    >
                        <ul className="!min-w-[250px]">
                            {cols.map((col, i) => {
                                return (
                                    <li
                                        key={i}
                                        className="flex flex-col"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <div className="flex items-center px-4 py-1">
                                            <label className="mb-0 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!hideCols.includes(col.accessor)}
                                                    className="form-checkbox"
                                                    defaultValue={col.accessor}
                                                    onChange={(event: any) => {
                                                        setHideCols(event.target.value);
                                                        showHideColumns(col.accessor);
                                                    }}
                                                />
                                                <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                                            </label>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </Dropdown>
                </div>
            </div>

            {/* contact List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'index',
                            title: '#',
                            width: 40,
                            render: ({ srNo }) => srNo,
                        },
                        {
                            accessor: 'name',
                            title: 'Name',
                            sortable: true,
                            render: ({ name, title }) => <div>{`${title} ${name}`}</div>,
                            hidden: hideCols.includes('name'),
                        },
                        {
                            accessor: 'phoneNumber',
                            title: 'Phone No',
                            sortable: true,
                            render: ({ phoneNumber }) => <div>{phoneNumber}</div>,
                            hidden: hideCols.includes('phoneNumber'),
                        },
                        {
                            accessor: 'email',
                            title: 'Email',
                            sortable: true,
                            render: ({ email }) => <div>{email}</div>,
                            hidden: hideCols.includes('email'),
                        },
                        {
                            accessor: 'position',
                            title: 'Position',
                            sortable: true,
                            render: ({ position }) => <div>{position}</div>,
                            hidden: hideCols.includes('position'),
                        },
                        {
                            accessor: 'industry',
                            title: 'Industry',
                            sortable: true,
                            render: ({ industry }) => <div>{industry}</div>,
                            hidden: hideCols.includes('industry'),
                        },
                        {
                            accessor: 'anniversary',
                            title: 'Wedding Anniversary',
                            sortable: true,
                            render: ({ anniversary }) => <div className="text-center">{new Date(anniversary).toLocaleDateString()}</div>,
                            hidden: hideCols.includes('anniversary'),
                        },
                        {
                            accessor: 'DOB',
                            title: 'Date Of Birth',
                            sortable: true,
                            render: ({ DOB }) => <div className="text-center">{new Date(DOB).toLocaleDateString()}</div>,
                            hidden: hideCols.includes('DOB'),
                        },
                        {
                            accessor: 'altPhoneNumber',
                            title: 'Alternative Number',
                            sortable: true,
                            render: ({ altPhoneNumber }) => <div>{altPhoneNumber}</div>,
                            hidden: hideCols.includes('altPhoneNumber'),
                        },
                        {
                            accessor: 'city',
                            title: 'City',
                            sortable: true,
                            render: ({ location }) => <div>{location?.city}</div>,
                            hidden: hideCols.includes('city'),
                        },
                        {
                            accessor: 'state',
                            title: 'State',
                            sortable: true,
                            render: ({ location }) => <div>{location?.state}</div>,
                            hidden: hideCols.includes('state'),
                        },
                        {
                            accessor: 'country',
                            title: 'Country',
                            sortable: true,
                            render: ({ location }) => <div>{location?.country}</div>,
                            hidden: hideCols.includes('country'),
                        },
                        {
                            accessor: 'createdAt',
                            title: 'Created Date',
                            sortable: true,
                            render: ({ createdAt }) => <div>{new Date(createdAt).toLocaleString()}</div>,
                            hidden: hideCols.includes('createdAt'),
                        },
                        {
                            accessor: 'updatedAt',
                            title: 'Last Updated',
                            sortable: true,
                            render: ({ updatedAt }) => <div>{new Date(updatedAt).toLocaleString()}</div>,
                            hidden: hideCols.includes('updatedAt'),
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
                    onPageChange={(page) => dispatch(setPage(page))}
                    recordsPerPageOptions={data?.length < 10 ? [10] : PAGE_SIZES}
                    onRecordsPerPageChange={(recordsPerPage) => dispatch(setPageSize(recordsPerPage))}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    fetching={loading}
                />
            </div>

            {/* edit modal */}
            {isAbleToUpdate && <ContactEditModal />}

            {/* view modal */}
            {viewModal && <ContactViewModal />}

            {/* delete modal */}
            {isAbleToDelete && deleteModal && <ContactDeleteModal />}

            {/* create modal */}
            {isAbleToCreate && createModal && <ContactCreateModal />}
        </div>
    );
};

export default Contacts;

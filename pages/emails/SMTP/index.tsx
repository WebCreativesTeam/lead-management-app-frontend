/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { GetMethodResponseType, IEmailSmtp } from '@/utils/Types';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { IRootState } from '@/store';
import { ApiClient } from '@/utils/http';
import { getAllEmailSmtp, setCreateModal, setEditModal, setViewModal, setDeleteModal } from '@/store/Slices/emailSlice/emailSmtpSlice';
import DeleteEmailSmtpModal from '@/components/emails/SMTP/DeleteEmailSmtpModal';
import CreateEmailSmtpModal from '@/components/emails/SMTP/CreateEmailSmtpModal';
import EditEmailSmtpModal from '@/components/emails/SMTP/EditEmailSmtpModal';
import ViewEmailSmtpModal from '@/components/emails/SMTP/ViewEmailSmtpModal';

const EmailSmtpPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Email SMTP'));
    });

    //hooks
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate } = useSelector((state: IRootState) => state.emailSmtp);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<IEmailSmtp[]>(data);
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

    //get all emailSmtp after page render
    useEffect(() => {
        getEmailSmtpList();
    }, [isFetching]);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    //get all EmailSmtp list
    const getEmailSmtpList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('smtp');
        const emailSmtp: IEmailSmtp[] = res?.data;
        if (typeof emailSmtp === 'undefined') {
            dispatch(getAllEmailSmtp([] as IEmailSmtp[]));
            return;
        }
        dispatch(getAllEmailSmtp(emailSmtp));
        setLoading(false);
    };

    //search emailSmtp
    const handleSearchEmailSmtp = () => {
        const searchEmailSmtpData = data?.filter((emailSmtp: IEmailSmtp) => {
            return (
                emailSmtp.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                emailSmtp.name.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                emailSmtp.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchEmailSmtpData);
        setRecordsData(searchEmailSmtpData);
    };

    return !isAbleToRead ? null : (
        <div>
            <PageHeadingSection description="Define Emails Smtp. Arrange by urgency. Optimize by email distribution. Enhance productivity." heading="Email SMTP" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[250px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Add New SMTP
                        </button>
                    </div>
                )}
                <div className="relative  flex-1">
                    <input type="text" placeholder="Find SMTP" className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]" onChange={(e) => setSearchInputText(e.target.value)} value={searchQuery} />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={handleSearchEmailSmtp}>
                        Search
                    </button>
                </div>
            </div>

            {/* Smtp List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'SMTP',
                            title: 'SMTP',
                            sortable: true,
                            render: ({ SMTP }) => <div>{SMTP}</div>,
                        },
                        {
                            accessor: 'name',
                            title: 'Name',
                            sortable: true,
                            render: ({ name }) => <div>{name}</div>,
                        },
                        {
                            accessor: 'email',
                            title: 'Email',
                            sortable: true,
                            render: ({ email }) => <div>{email}</div>,
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
            <EditEmailSmtpModal />

            {/* view modal */}
            <ViewEmailSmtpModal />

            {/* delete modal */}
            <DeleteEmailSmtpModal />

            {/* create modal */}
            <CreateEmailSmtpModal />
        </div>
    );
};

export default EmailSmtpPage;

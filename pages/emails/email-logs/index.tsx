/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { GetMethodResponseType, IEmailLog } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import { getAllEmailLogs, setViewModal } from '@/store/Slices/emailSlice/emailLogSlice';
import EmailLogViewModal from '@/components/emails/EmailLogs/EmailLogViewModal';

const EmailLog = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Email Logs | Email'));
    });
    const { data, isFetching, isAbleToRead } = useSelector((state: IRootState) => state.emailLog);

    //hooks
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<IEmailLog[]>(data);
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

    //get all emailLog after page render
    useEffect(() => {
        getEmailLogList();
    }, [isFetching]);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);
    //get all EmailLog list
    const getEmailLogList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('email');
        const emailLog: IEmailLog[] = res?.data;
        if (typeof emailLog === 'undefined') {
            dispatch(getAllEmailLogs([] as IEmailLog[]));
            return;
        }
        dispatch(getAllEmailLogs(emailLog));
        setLoading(false);
    };

    //search emailLog
    const handleSearchEmailLog = () => {
        const searchEmailLogData = data?.filter((emailLog: IEmailLog) => {
            return (
                emailLog.senderName.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                emailLog.senderName.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                emailLog.senderName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                emailLog.receiverEmail.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                emailLog.receiverEmail.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                emailLog.receiverEmail.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchEmailLogData);
        setRecordsData(searchEmailLogData);
    };

    return (
        <div>
            <PageHeadingSection description="View all email logs" heading="Email Logs" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                <div className="flex-1"></div>
                <div className="relative flex-1">
                    <input type="text" placeholder="Find Log" className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]" onChange={(e) => setSearchInputText(e.target.value)} value={searchQuery} />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={handleSearchEmailLog}>
                        Search
                    </button>
                </div>
            </div>

            {/* emailLog List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'senderName',
                            title: 'Sender Name',
                            sortable: true,
                            render: ({ senderName }) => <div>{senderName}</div>,
                        },
                        {
                            accessor: 'senderEmail',
                            title: 'Sender Email',
                            sortable: true,
                            render: ({ senderEmail }) => <div>{senderEmail}</div>,
                        },
                        {
                            accessor: 'receiverEmail',
                            title: 'Receiver Email',
                            sortable: true,
                            render: ({ receiverEmail }) => <div>{receiverEmail}</div>,
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

            {/* view modal */}
            <EmailLogViewModal />
        </div>
    );
};

export default EmailLog;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { ChatIcon, Delete, Edit, Email, View, Sms } from '@/utils/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { GetMethodResponseType, IFollowup, LeadStatusSecondaryEndpoint, SourceDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import Select from 'react-select';
import {
    getAllLeadStatusForScheduleMessage,
    getAllSourceForScheduleMessage,
    setDeleteModal,
    setEditModal,
    setScheduleMessageDataLength,
    setViewModal,
} from '@/store/Slices/automationSlice/scheduleMessageSlice';
import ScheduleMessageViewModal from '@/components/Automation/ScheduleMessage/ScheduleMessageViewModal';
import ScheduleMessageEditModal from '@/components/Automation/ScheduleMessage/ScheduleMessageEditModal';
import ScheduleMessageDeleteModal from '@/components/Automation/ScheduleMessage/ScheduleMessageDeleteModal';
import { followUpDropdownList, followupData } from '@/utils/Raw Data';
import { getAllPendingFollowups, getAllTodayFollowups, getAllTomorrowFollowups } from '@/store/Slices/dashbordSlice';
import FollowUpCard from '@/components/Dashboard/FollowUpCard';

const Dashboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Track Leads | ScheduleMessages'));
    });
    const { todayFollowUps, isFetching, totalRecords } = useSelector((state: IRootState) => state.dashboard);

    //hooks
    const [loading, setLoading] = useState<boolean>(false);
    const [followupBy, setFollowupBy] = useState<string>('');

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<IFollowup[]>([] as IFollowup[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });
    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    //get all scheduleMessage after page render
    useEffect(() => {
        getTodayFollowupList();
        getTomorrowFollowupList();
        getPendingFollowupList();
    }, [isFetching, pageSize, page]);

    useEffect(() => {
        setRecordsData(todayFollowUps);
    }, [todayFollowUps]);

    useEffect(() => {
        getAllSourceList();
        getLeadStatus();
    }, []);

    //get all ScheduleMessage list
    const getTodayFollowupList = async () => {
        setLoading(true);
        // const res: GetMethodResponseType = await new ApiClient().get(`schedule-message?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        // const scheduleMessage: IFollowup[] = res?.data;
        // if (typeof scheduleMessage === 'undefined') {
        //     dispatch(getAllScheduleMessages([] as IFollowup[]));
        //     return;
        // }
        dispatch(getAllTodayFollowups(followupData));
        dispatch(setScheduleMessageDataLength(followupData.length));
        setLoading(false);
    };

    //get all ScheduleMessage list
    const getTomorrowFollowupList = async () => {
        setLoading(true);
        // const res: GetMethodResponseType = await new ApiClient().get(`schedule-message?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        // const scheduleMessage: IFollowup[] = res?.data;
        // if (typeof scheduleMessage === 'undefined') {
        //     dispatch(getAllScheduleMessages([] as IFollowup[]));
        //     return;
        // }
        dispatch(getAllTomorrowFollowups(followupData));
        dispatch(setScheduleMessageDataLength(followupData.length));
        setLoading(false);
    };

    //get all ScheduleMessage list
    const getPendingFollowupList = async () => {
        setLoading(true);
        // const res: GetMethodResponseType = await new ApiClient().get(`schedule-message?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        // const scheduleMessage: IFollowup[] = res?.data;
        // if (typeof scheduleMessage === 'undefined') {
        //     dispatch(getAllScheduleMessages([] as IFollowup[]));
        //     return;
        // }
        dispatch(getAllPendingFollowups(followupData));
        dispatch(setScheduleMessageDataLength(followupData.length));
        setLoading(false);
    };

    //get all Source list
    const getAllSourceList = async () => {
        const sourceList: GetMethodResponseType = await new ApiClient().get('source/list');
        const source: SourceDataType[] = sourceList?.data;
        if (typeof source === 'undefined') {
            dispatch(getAllSourceForScheduleMessage([] as SourceDataType[]));
            return;
        }
        dispatch(getAllSourceForScheduleMessage(source));
    };

    //get all lead status list
    const getLeadStatus = async () => {
        const leadStatusList: GetMethodResponseType = await new ApiClient().get('lead-status/list');
        const status: LeadStatusSecondaryEndpoint[] = leadStatusList?.data;
        if (typeof status === 'undefined') {
            dispatch(getAllLeadStatusForScheduleMessage([] as LeadStatusSecondaryEndpoint[]));
            return;
        }
        dispatch(getAllLeadStatusForScheduleMessage(status));
    };

    return (
        <div>
            <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-3">
                <FollowUpCard title="Today Followups" followUpPercentage="-2.35%" followups={74137} lastWeekFollowUps={84709} color="#06b6d4" />
                <FollowUpCard title="Tomorrow Followups" followUpPercentage="-2.35%" followups={74137} lastWeekFollowUps={84709} color="#8b5cf6" />
                <FollowUpCard title="Pending Followups" followUpPercentage="+ 1.35%" followups={38085} lastWeekFollowUps={37894} color="#3b82f6" />
                <FollowUpCard title="Total Leads" followUpPercentage="+ 1.35%" followups={38085} lastWeekFollowUps={37894} color="#d946ef" />
                <FollowUpCard title="Total Fresh Leads" followUpPercentage="+ 1.35%" followups={38085} lastWeekFollowUps={37894} color="#3b82f6" />
            </div>
            <div className="datatables panel mt-6">
                <div className="z-10 my-6 flex flex-col items-center gap-5 sm:flex-row">
                    <div className="flex-1">
                        <p className="text-lg font-bold">Followups</p>
                    </div>
                    <div className="flex-1">
                        <Select placeholder="Choose Followup" className="z-10" options={followUpDropdownList} onChange={(data: any) => setFollowupBy(data.value)} />
                    </div>
                </div>

                {/* scheduleMessage List table*/}
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'name',
                            title: 'Name',
                            sortable: true,
                            render: ({ name }) => <div>{name}</div>,
                        },
                        {
                            accessor: 'phoneNumber',
                            title: 'Phone Number',
                            sortable: true,
                            render: ({ phoneNumber }) => <div>{phoneNumber}</div>,
                        },
                        {
                            accessor: 'source',
                            title: 'Source',
                            sortable: true,
                            render: ({ source }) => <div>{source?.name}</div>,
                        },
                        {
                            accessor: 'product',
                            title: 'Product',
                            sortable: true,
                            render: ({ product }) => <div>{product}</div>,
                        },
                        {
                            accessor: 'status',
                            title: 'Status',
                            sortable: true,
                            render: ({ status }) => <div>{status.name}</div>,
                        },
                        {
                            accessor: 'priority',
                            title: 'Priority',
                            sortable: true,
                            render: ({ priority }) => <div>{priority?.name}</div>,
                        },
                        {
                            accessor: 'createdAt',
                            title: 'Created Date',
                            sortable: true,
                            render: ({ createdAt }) => <div>{createdAt}</div>,
                        },
                        {
                            accessor: 'updatedAt',
                            title: 'Last Update',
                            sortable: true,
                            render: ({ updatedAt }) => <div>{updatedAt}</div>,
                        },
                        {
                            accessor: 'nextFollowup',
                            title: 'Next Follow Up',
                            sortable: true,
                            render: ({ nextFollowup }) => <div>{nextFollowup}</div>,
                        },
                        {
                            accessor: 'quickMessage',
                            title: 'Quick Message',
                            titleClassName: '!text-center',
                            render: ({ id }) => (
                                <div className="flex justify-center gap-2  p-3 text-center ">
                                    <Tippy content="WhatsApp">
                                        <button type="button" onClick={() => dispatch(setViewModal({ id, open: true }))}>
                                            <Sms />
                                        </button>
                                    </Tippy>
                                    {/* {isAbleToUpdate && ( */}
                                    <Tippy content="SMS">
                                        <button type="button" onClick={() => dispatch(setEditModal({ id, open: true }))}>
                                            <ChatIcon />
                                        </button>
                                    </Tippy>
                                    {/* )} */}
                                    {/* {isAbleToDelete && ( */}
                                    <Tippy content="Email">
                                        <button type="button" onClick={() => dispatch(setDeleteModal({ id, open: true }))}>
                                            <Email />
                                        </button>
                                    </Tippy>
                                    {/* )} */}
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
                                    {/* {isAbleToUpdate && ( */}
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => dispatch(setEditModal({ id, open: true }))}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    {/* )} */}
                                    {/* {isAbleToDelete && ( */}
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => dispatch(setDeleteModal({ id, open: true }))}>
                                            <Delete />
                                        </button>
                                    </Tippy>
                                    {/* )} */}
                                </div>
                            ),
                        },
                    ]}
                    totalRecords={totalRecords}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    recordsPerPageOptions={todayFollowUps?.length < 10 ? [10] : PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    fetching={loading}
                />
            </div>

            {/* edit modal */}
            <ScheduleMessageEditModal />

            {/* view modal */}
            <ScheduleMessageViewModal />

            {/* delete modal */}
            <ScheduleMessageDeleteModal />
        </div>
    );
};

export default Dashboard;

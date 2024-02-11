/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy, values } from 'lodash';
import { ChatIcon, Delete, Edit, Email, View, Sms } from '@/utils/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { GetMethodResponseType, IFollowup, ILeadStatus, LeadStatusSecondaryEndpoint, SelectOptionsType, SourceDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import Select from 'react-select';
import { getAllLeadStatusForCampaign, getAllSourceForCampaign, setDeleteModal, setEditModal, setCampaignDataLength, setViewModal } from '@/store/Slices/campaignSlice';
import ScheduleMessageViewModal from '@/components/Campaign/CampaignViewModal';
import ScheduleMessageEditModal from '@/components/Campaign/CampaignEditModal';
import ScheduleMessageDeleteModal from '@/components/Campaign/CampaignDeleteModal';
import { followUpDropdownList } from '@/utils/Raw Data';
import { getAllLeadStatusForDashboard, getFollowUps, setDashboardDataLength } from '@/store/Slices/dashbordSlice';
import FollowUpCard from '@/components/Dashboard/FollowUpCard';
import { setEmailTemplateModal, setSmsTemplateModal, setWhatsappTemplateModal } from '@/store/Slices/leadSlice/manageLeadSlice';
import WhatsappTemplateModal from '@/components/Leads/ManageLeads/WhatsappTemplateModal';
import SmsTemplateModal from '@/components/Leads/ManageLeads/SmsTemplateModal';
import EmailTemplateModal from '@/components/Leads/ManageLeads/EmailTemplateModal';

const Dashboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Track Leads | ScheduleMessages'));
    });
    const { data, isFetching, totalRecords, leadStatusList } = useSelector((state: IRootState) => state.dashboard);

    const { whatsAppTemplateModal, emailTemplateModal, smsTemplateModal } = useSelector((state: IRootState) => state.lead);

    //hooks
    const [loading, setLoading] = useState<boolean>(false);
    const [followupBy, setFollowupBy] = useState<string>(followUpDropdownList[0]?.value);
    const [leadSatusDropdown, setLeadSatusDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<IFollowup[]>([] as IFollowup[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [filter, setFilter] = useState('');
    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    //get all scheduleMessage after page render
    useEffect(() => {
        getFollowUpList();
    }, [isFetching, pageSize, page, filter]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    useEffect(() => {
        getAllSourceList();
        getLeadStatus();
    }, []);

    useEffect(() => {
        if (leadSatusDropdown?.length > 0) {
            setFilter(`/today?statusId=${leadSatusDropdown[0]?.value}`);
            setSelectedStatus(leadSatusDropdown[0]?.value);
        }
    }, [leadSatusDropdown]);

    //get all ScheduleMessage list
    const getFollowUpList = async () => {
        if (filter) {
            setLoading(true);
            const res: GetMethodResponseType = await new ApiClient().get(`lead${filter}?limit=${pageSize}&page=${page}`);
            const resData: IFollowup[] = res?.data;
            if (typeof resData === 'undefined') {
                dispatch(getFollowUps([] as IFollowup[]));
                return;
            }
            dispatch(getFollowUps(resData));
            dispatch(setDashboardDataLength(res?.meta?.totalCount));
            setLoading(false);
        }
    };

    // get all Source list
    const getAllSourceList = async () => {
        const sourceList: GetMethodResponseType = await new ApiClient().get('source/list');
        const source: SourceDataType[] = sourceList?.data;
        if (typeof source === 'undefined') {
            dispatch(getAllSourceForCampaign([] as SourceDataType[]));
            return;
        }
        dispatch(getAllSourceForCampaign(source));
    };

    // get all lead status list
    const getLeadStatus = async () => {
        const leadStatusList: GetMethodResponseType = await new ApiClient().get('lead-status/list');
        const status: ILeadStatus[] = leadStatusList?.data;
        if (typeof status === 'undefined') {
            dispatch(getAllLeadStatusForDashboard([] as ILeadStatus[]));
            return;
        }
        dispatch(getAllLeadStatusForDashboard(status));
    };

    useEffect(() => {
        const createLeadStatusDropdown: SelectOptionsType[] = leadStatusList?.map((item: LeadStatusSecondaryEndpoint) => {
            return {
                value: item.id,
                label: (
                    <div className={`rounded px-2.5 py-0.5 text-center text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: item?.color, backgroundColor: item?.color + '20' }}>
                        {item?.name}
                    </div>
                ),
            };
        });
        setLeadSatusDropdown(createLeadStatusDropdown);
    }, [leadStatusList]);

    console.log(filter);
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
                    <div className="flex flex-1 gap-6">
                        {leadSatusDropdown?.length > 0 && (
                            <Select
                                placeholder="Select Status"
                                className="z-10 flex-1"
                                options={leadSatusDropdown}
                                onChange={(data: any) => {
                                    setFilter(`/${followupBy}?statusId=${data.value}`);
                                    setSelectedStatus(data.value);
                                }}
                                defaultValue={leadSatusDropdown[0]}
                            />
                        )}

                        <Select
                            placeholder="Choose Followup"
                            className="z-10 flex-1"
                            options={followUpDropdownList}
                            defaultValue={followUpDropdownList[0]}
                            onChange={(data: any) => {
                                setFilter(`/${data.value}?statusId=${selectedStatus}`);
                                setFollowupBy(data.value);
                            }}
                        />
                    </div>
                </div>

                {/* scheduleMessage List table*/}
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'srNo',
                            title: '#',
                            sortable: true,
                            render: ({ srNo }) => <div>{srNo}</div>,
                        },
                        {
                            accessor: 'contact',
                            title: 'Name',
                            sortable: true,
                            render: ({ contact }) => <div>{contact?.name}</div>,
                        },
                        {
                            accessor: 'phoneNumber',
                            title: 'Phone Number',
                            sortable: true,
                            render: ({ contact }) => <div>{contact?.phoneNumber}</div>,
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
                            render: ({ product }) => <div>{product?.name}</div>,
                        },
                        // {
                        //     accessor: 'status',
                        //     title: 'Status',
                        //     sortable: true,
                        //     render: ({ status }) => <div>{status.name}</div>,
                        // },
                        {
                            accessor: 'name',
                            title: 'Lead Status Name',
                            sortable: true,
                            render: ({ status }) => (
                                <span
                                    className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                    style={{ color: status?.color, backgroundColor: status?.color + '20' }}
                                >
                                    {status?.name}
                                </span>
                            ),
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
                            render: ({ followUpDate }) => <div>{followUpDate}</div>,
                        },
                        {
                            accessor: 'quickMessage',
                            title: 'Quick Message',
                            titleClassName: '!text-center',
                            render: ({ id }) => (
                                <div className="flex justify-center gap-2  p-3 text-center ">
                                    <Tippy content="WhatsApp">
                                        <button type="button" onClick={() => dispatch(setWhatsappTemplateModal({ id, open: true }))}>
                                            <Sms />
                                        </button>
                                    </Tippy>
                                    {/* {isAbleToUpdate && ( */}
                                    <Tippy content="SMS">
                                        <button type="button" onClick={() => dispatch(setSmsTemplateModal({ id, open: true }))}>
                                            <ChatIcon />
                                        </button>
                                    </Tippy>
                                    {/* )} */}
                                    {/* {isAbleToDelete && ( */}
                                    <Tippy content="Email">
                                        <button type="button" onClick={() => dispatch(setEmailTemplateModal({ id, open: true }))}>
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
                                        <button
                                            type="button"
                                            // onClick={() => dispatch(setViewModal({ id, open: true }))}
                                        >
                                            <View />
                                        </button>
                                    </Tippy>
                                    {/* {isAbleToUpdate && ( */}
                                    <Tippy content="Edit">
                                        <button
                                            type="button"
                                            // onClick={() => dispatch(setEditModal({ id, open: true }))}
                                        >
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    {/* )} */}
                                    {/* {isAbleToDelete && ( */}
                                    <Tippy content="Delete">
                                        <button
                                            type="button"
                                            // onClick={() => dispatch(setDeleteModal({ id, open: true }))}
                                        >
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
            {/* <ScheduleMessageEditModal /> */}

            {/* view modal */}
            {/* <ScheduleMessageViewModal /> */}

            {/* delete modal */}
            {/* <ScheduleMessageDeleteModal /> */}

            {/* send whatsapp template priority modal */}
            {whatsAppTemplateModal && <WhatsappTemplateModal />}

            {/* send sms template priority modal */}
            {smsTemplateModal && <SmsTemplateModal />}

            {/* send email template priority modal */}
            {emailTemplateModal && <EmailTemplateModal />}
        </div>
    );
};

export default Dashboard;

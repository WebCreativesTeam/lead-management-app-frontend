/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { GetMethodResponseType, ICampaign, LeadStatusSecondaryEndpoint, SourceDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import { getAllLeadStatusForCampaign, getAllCampaigns, getAllSourceForCampaign, setCreateModal, setDeleteModal, setEditModal, setCampaignDataLength, setViewModal } from '@/store/Slices/campaignSlice';
import CampaignViewModal from '@/components/Campaign/CampaignViewModal';
import CampaignCreateModal from '@/components/Campaign/CampaignCreateModal';
import CampaignEditModal from '@/components/Campaign/CampaignEditModal';
import CampaignDeleteModal from '@/components/Campaign/CampaignDeleteModal';
import { scheduleMessagesRawData } from '@/utils/Raw Data';
import ToggleSwitch from '@/components/__Shared/ToggleSwitch';

const Campaign = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Track Leads | Campaigns'));
    });
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToUpdate, totalRecords } = useSelector((state: IRootState) => state.campaign);

    //hooks
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<ICampaign[]>([] as ICampaign[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });
    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(search);

    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    //get all campaign after page render
    useEffect(() => {
        getCampaignList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    useEffect(() => {
        getAllSourceList();
        getLeadStatus();
    }, []);

    //get all Campaign list
    const getCampaignList = async () => {
        setLoading(true);
        // const res: GetMethodResponseType = await new ApiClient().get(`schedule-message?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        // const campaign: ICampaign[] = res?.data;
        // if (typeof campaign === 'undefined') {
        //     dispatch(getAllCampaigns([] as ICampaign[]));
        //     return;
        // }
        dispatch(getAllCampaigns(scheduleMessagesRawData));
        dispatch(setCampaignDataLength(scheduleMessagesRawData.length));
        setLoading(false);
    };

    //get all Source list
    const getAllSourceList = async () => {
        const sourceList: GetMethodResponseType = await new ApiClient().get('source/list');
        const source: SourceDataType[] = sourceList?.data;
        if (typeof source === 'undefined') {
            dispatch(getAllSourceForCampaign([] as SourceDataType[]));
            return;
        }
        dispatch(getAllSourceForCampaign(source));
    };

    //get all lead status list
    const getLeadStatus = async () => {
        const leadStatusList: GetMethodResponseType = await new ApiClient().get('lead-status/list');
        const status: LeadStatusSecondaryEndpoint[] = leadStatusList?.data;
        if (typeof status === 'undefined') {
            dispatch(getAllLeadStatusForCampaign([] as LeadStatusSecondaryEndpoint[]));
            return;
        }
        dispatch(getAllLeadStatusForCampaign(status));
    };

    return (
        <div>
            <PageHeadingSection description="Schedule message using template and for different platforms." heading="Schedule Message" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {/* {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : ( */}
                <div className="flex-1">
                    <button className="btn btn-primary h-full max-w-fit max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                        <Plus />
                        Add Scheduled Message
                    </button>
                </div>
                {/* )} */}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find A Campaign"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* campaign List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'scheduleName',
                            title: 'Schedule Name',
                            sortable: true,
                            render: ({ campaignName }) => <div>{campaignName}</div>,
                        },
                        {
                            accessor: 'leadStatus',
                            title: 'Lead Status',
                            sortable: true,
                            render: ({ leadStatus }) => <div>{leadStatus}</div>,
                        },
                        {
                            accessor: 'source',
                            title: 'Source',
                            sortable: true,
                            render: ({ source }) => <div>{source}</div>,
                        },
                        {
                            accessor: 'product',
                            title: 'Product',
                            sortable: true,
                            render: ({ product }) => <div>{product}</div>,
                        },
                        {
                            accessor: 'template',
                            title: 'Template',
                            sortable: true,
                            render: ({ template }) => <div>{template}</div>,
                        },
                        {
                            accessor: 'schedule',
                            title: 'Schedule',
                            sortable: true,
                            render: ({ schedule }) => <div>{schedule}</div>,
                        },
                        {
                            accessor: 'platform',
                            title: 'Platform',
                            sortable: true,
                            render: ({ platform }) => <div>{platform.join(' , ')}</div>,
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
                        {
                            accessor: 'Status',
                            title: 'Status',
                            sortable: true,
                            render: ({ status }) => (
                                <div>
                                    <label className="relative h-6 w-12">
                                        <input
                                            type="checkbox"
                                            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                            id="custom_switch_checkbox1"
                                            name="permission"
                                            defaultChecked={status}
                                            // checked={isDefault}
                                            // onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setDefaultPolicyModal({ id, open: true, switchValue: e.target.checked }))}
                                        />
                                        <ToggleSwitch />
                                    </label>
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
            <CampaignEditModal />

            {/* view modal */}
            <CampaignViewModal />

            {/* delete modal */}
            <CampaignDeleteModal />

            {/* create modal */}
            <CampaignCreateModal />
        </div>
    );
};

export default Campaign;

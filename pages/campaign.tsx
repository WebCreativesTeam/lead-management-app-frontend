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
import { GetMethodResponseType, ICampaign, ILeadStatus, LeadStatusSecondaryEndpoint, ProductSecondaryEndpointType, SourceDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import {
    getAllLeadStatusForCampaign,
    getAllCampaigns,
    getAllSourceForCampaign,
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setCampaignDataLength,
    setViewModal,
    setCampaigndActivationModal,
    getAllProductsForCampaign,
    getAllWhatsappTemplatesForCampaign,
    getAllEmailTemplatesForCampaign,
    getAllSmsTemplatesForCampaign,
} from '@/store/Slices/campaignSlice';
import CampaignViewModal from '@/components/Campaign/CampaignViewModal';
import CampaignCreateModal from '@/components/Campaign/CampaignCreateModal';
import CampaignEditModal from '@/components/Campaign/CampaignEditModal';
import CampaignDeleteModal from '@/components/Campaign/CampaignDeleteModal';
import ToggleSwitch from '@/components/__Shared/ToggleSwitch';
import CampaignActivateModal from '@/components/Campaign/CampaignActivateModal';

const Campaign = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Track Leads | Campaigns'));
    });
    const {
        data,
        isFetching,
        isAbleToRead,
        isAbleToCreate,
        isAbleToDelete,
        isAbleToUpdate,
        totalRecords,
        createModal,
        editModal,
        viewModal,
        deleteModal,
        campaignActivationModal,
        isAbleToActivateCampaign,
    } = useSelector((state: IRootState) => state.campaign);

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
        getAllProducts();
        getAllEmailTemplates();
        getAllWhatsappTemplates();
        getAllSmsTemplates();
    }, []);

    //get all Campaign list
    const getCampaignList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`campaign`);
        const campaign: ICampaign[] = res?.data;
        if (typeof campaign === 'undefined') {
            dispatch(getAllCampaigns([] as ICampaign[]));
            return;
        }
        dispatch(getAllCampaigns(campaign));
        dispatch(setCampaignDataLength(campaign.length));
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
        const leadStatusList: GetMethodResponseType = await new ApiClient().get('lead-status');
        const status: ILeadStatus[] = leadStatusList?.data;
        if (typeof status === 'undefined') {
            dispatch(getAllLeadStatusForCampaign([] as ILeadStatus[]));
            return;
        }
        dispatch(getAllLeadStatusForCampaign(status));
    };

    //get products list
    const getAllProducts = async () => {
        setLoading(true);
        const productsList: GetMethodResponseType = await new ApiClient().get('product/list');
        const products: ProductSecondaryEndpointType[] = productsList?.data;
        if (typeof products === 'undefined') {
            dispatch(getAllProductsForCampaign([] as ProductSecondaryEndpointType[]));
            return;
        }
        dispatch(getAllProductsForCampaign(products));
    };

    //get email template list
    const getAllEmailTemplates = async () => {
        const emailLIst: GetMethodResponseType = await new ApiClient().get('email-template/list');
        const emails: ProductSecondaryEndpointType[] = emailLIst?.data;
        if (typeof emails === 'undefined') {
            dispatch(getAllEmailTemplatesForCampaign([] as ProductSecondaryEndpointType[]));
            return;
        }
        dispatch(getAllEmailTemplatesForCampaign(emails));
    };

    //get whatsapp template list
    const getAllWhatsappTemplates = async () => {
        const whatsappTemplateList: GetMethodResponseType = await new ApiClient().get('whatsapp-template/list');
        const whatsappList: ProductSecondaryEndpointType[] = whatsappTemplateList?.data;
        if (typeof whatsappList === 'undefined') {
            dispatch(getAllWhatsappTemplatesForCampaign([] as ProductSecondaryEndpointType[]));
            return;
        }
        dispatch(getAllWhatsappTemplatesForCampaign(whatsappList));
    };

    //get sms template list
    const getAllSmsTemplates = async () => {
        const smsList: GetMethodResponseType = await new ApiClient().get('sms-template/list');
        const smsArr: ProductSecondaryEndpointType[] = smsList?.data;
        if (typeof smsArr === 'undefined') {
            dispatch(getAllSmsTemplatesForCampaign([] as ProductSecondaryEndpointType[]));
            return;
        }
        dispatch(getAllSmsTemplatesForCampaign(smsArr));
    };

    useEffect(() => {
        let srNoArray: number[] = [];
        for (let i = pageSize * page - pageSize; i <= pageSize * page; i++) {
            srNoArray.push(i);
        }
        srNoArray.shift();
        if (recordsData.length > 0) {
            const serializedData = recordsData?.map((item, index) => {
                return { ...item, srNo: srNoArray[index] };
            });
            setRecordsData(serializedData);
        }
    }, [page, pageSize, recordsData]);

    return (
        isAbleToRead && (
            <div>
                <PageHeadingSection description="campaign message using template and for different platforms." heading="Campaign Message" />
                <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                    {!isAbleToCreate ? (
                        <div className="flex-1"></div>
                    ) : (
                        <div className="flex-1">
                            <button className="btn btn-primary h-full max-w-fit max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                                <Plus />
                                Add Campaign
                            </button>
                        </div>
                    )}
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
                                accessor: 'srNo',
                                title: '#',
                                width: 40,
                                render: ({ srNo }) => srNo,
                            },
                            {
                                accessor: 'name',
                                title: 'Campaign Name',
                                sortable: true,
                                render: ({ name }) => <div>{name}</div>,
                            },
                            {
                                accessor: 'type',
                                title: 'Type',
                                sortable: true,
                                render: ({ type }) => <div>{type}</div>,
                            },
                            {
                                accessor: 'sendTo',
                                title: 'Send To',
                                sortable: true,
                                render: ({ sendTo }) => <div>{sendTo}</div>,
                            },
                            {
                                accessor: 'active',
                                title: 'Active',
                                sortable: true,
                                render: ({ isActive, id }) =>
                                    isAbleToActivateCampaign ? (
                                        <div>
                                            <label className="relative h-6 w-12">
                                                <input
                                                    type="checkbox"
                                                    className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                                    id="custom_switch_checkbox1"
                                                    name="active"
                                                    checked={isActive}
                                                    onChange={() => dispatch(setCampaigndActivationModal({ id, open: true }))}
                                                />
                                                <ToggleSwitch />
                                            </label>
                                        </div>
                                    ) : (
                                        <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                            {isActive ? 'Active' : 'In Active'}
                                        </span>
                                    ),
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
                {isAbleToUpdate && <CampaignEditModal />}

                {/* view modal */}
                {viewModal && <CampaignViewModal />}

                {/* delete modal */}
                {isAbleToDelete && deleteModal && <CampaignDeleteModal />}

                {/* create modal */}
                {isAbleToCreate && createModal && <CampaignCreateModal />}

                {/* campaign activation modal */}
                {isAbleToActivateCampaign && campaignActivationModal && <CampaignActivateModal />}
            </div>
        )
    );
};

export default Campaign;

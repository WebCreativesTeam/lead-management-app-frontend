/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { GetMethodResponseType, ISmsTemplate } from '@/utils/Types';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { IRootState } from '@/store';
import { ApiClient } from '@/utils/http';
import { getAllSmsTemplates, setCreateModal, setEditModal, setViewModal, setDeleteModal, setSmsTemplateDataLength, setPageSize, setPage } from '@/store/Slices/templateSlice/smsTemplateSlice';
import DeleteSmsTemplateModal from '@/components/Templates/SmsTemplate/DeleteSmsTemplateModal';
import CreateSmsTemplateModal from '@/components/Templates/SmsTemplate/CreateSmsTemplateModal';
import EditSmsTemplateModal from '@/components/Templates/SmsTemplate/EditSmsTemplateModal';
import ViewSmsTemplateModal from '@/components/Templates/SmsTemplate/ViewSmsTemplateModal';
import { PAGE_SIZES } from '@/utils/contant';

const SmsTemplatePage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Sms Template Page'));
    });

    //hooks
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, totalRecords, pageSize, page } = useSelector((state: IRootState) => state.smsTemplate);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable

    const [recordsData, setRecordsData] = useState<ISmsTemplate[]>([] as ISmsTemplate[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(search);

    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        dispatch(setPage(1));
    }, [sortStatus]);

    //get all smsTemplate after page render
    useEffect(() => {
        getSmsTemplateList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all SmsTemplate list
    const getSmsTemplateList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`sms-template?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        const priority: ISmsTemplate[] = res?.data;
        if (typeof priority === 'undefined') {
            dispatch(getAllSmsTemplates([] as ISmsTemplate[]));
            return;
        }
        dispatch(getAllSmsTemplates(priority));
        dispatch(setSmsTemplateDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    return !isAbleToRead ? null : (
        <div>
            <PageHeadingSection description="Create Sms templates. Arrange by urgency. Enhance productivity." heading="Manage SMS" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[250px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Create New Template
                        </button>
                    </div>
                )}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find Template"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* sms template List table*/}
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
                            title: 'Sms Template Name',
                            sortable: true,
                            render: ({ name }) => <span>{name}</span>,
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
            <EditSmsTemplateModal />

            {/* view modal */}
            <ViewSmsTemplateModal />

            {/* delete modal */}
            <DeleteSmsTemplateModal />

            {/* create modal */}
            <CreateSmsTemplateModal />
        </div>
    );
};

export default SmsTemplatePage;

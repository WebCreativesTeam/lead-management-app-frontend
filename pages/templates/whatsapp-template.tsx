/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { GetMethodResponseType, IWhatsappTemplate } from '@/utils/Types';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { IRootState } from '@/store';
import { ApiClient } from '@/utils/http';
import { getAllWhatsappTemplates, setCreateModal, setEditModal, setViewModal, setDeleteModal, setWhatsappTemplateDataLength, setPage, setPageSize } from '@/store/Slices/templateSlice/whatsappTemplateSlice';
import DeleteWhatsappTemplateModal from '@/components/Templates/WhatsAppTemplate/DeleteWhatsappTemplateModal';
import CreateWhatsappTemplateModal from '@/components/Templates/WhatsAppTemplate/CreateWhatsappTemplateModal';
import EditWhatsappTemplateModal from '@/components/Templates/WhatsAppTemplate/EditWhatsappTemplateModal';
import ViewWhatsappTemplateModal from '@/components/Templates/WhatsAppTemplate/ViewWhatsappTemplateModal';
import { PAGE_SIZES } from '@/utils/contant';

const WhatsappTemplatePage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Whatsapp Template Page'));
    });

    //hooks
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, totalRecords, pageSize, page } = useSelector((state: IRootState) => state.whatsappTemplate);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable

    const [recordsData, setRecordsData] = useState<IWhatsappTemplate[]>([] as IWhatsappTemplate[]);
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

    //get all whatsappTemplate after page render
    useEffect(() => {
        getWhatsappTemplateList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all WhatsappTemplate list
    const getWhatsappTemplateList = async () => {
        setLoading(true);
        // const res: GetMethodResponseType = await new ApiClient().get(`whatspp-template?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        const res: GetMethodResponseType = await new ApiClient().get('whatsapp-template');
        const priority: IWhatsappTemplate[] = res?.data;
        if (typeof priority === 'undefined') {
            dispatch(getAllWhatsappTemplates([] as IWhatsappTemplate[]));
            return;
        }
        dispatch(getAllWhatsappTemplates(priority));
        dispatch(setWhatsappTemplateDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    // return !isAbleToRead ? null : (
    return (
        <div>
            <PageHeadingSection description="Create whatsapp templates. Arrange by urgency. Enhance productivity." heading="Manage Whatsapp Templates" />
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

            {/* whatsapp template List table*/}
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
                            title: 'Whatsapp Template Name',
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
            <EditWhatsappTemplateModal />

            {/* view modal */}
            <ViewWhatsappTemplateModal />

            {/* delete modal */}
            <DeleteWhatsappTemplateModal />

            {/* create modal */}
            <CreateWhatsappTemplateModal />
        </div>
    );
};

export default WhatsappTemplatePage;

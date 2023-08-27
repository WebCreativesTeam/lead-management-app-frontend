/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import Swal from 'sweetalert2';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { GetMethodResponseType, SourceDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import { getAllSources, setCreateModal, setDeleteModal, setDisableBtn, setEditModal, setFetching, setViewModal } from '@/store/Slices/sourceSlice';
import SourceViewModal from '@/components/Sources/SourceViewModal';
import SourceCreateModal from '@/components/Sources/SourceCreateModal';
import SourceEditModal from '@/components/Sources/SourceEditModal';

const Source = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Track Leads | Sources'));
    });
    const data: SourceDataType[] = useSelector((state: IRootState) => state.source.data);
    const fetching: boolean = useSelector((state: IRootState) => state.source.isFetching);
    const isBtnDisabled: boolean = useSelector((state: IRootState) => state.source.isBtnDisabled);
    const deleteModal: boolean = useSelector((state: IRootState) => state.source.deleteModal);
    const singleSource: SourceDataType = useSelector((state: IRootState) => state.source.singleData);
    //hooks
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<SourceDataType[]>(data);
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

    //get all source after page render
    useEffect(() => {
        getSourceList();
    }, [fetching]);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);
    //get all Source list
    const getSourceList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('sources');
        const source: SourceDataType[] = res?.data;
        if (typeof source ==="undefined") {
            dispatch(getAllSources([] as SourceDataType[]));
            return;
        }
        dispatch(getAllSources(source));
        setLoading(false);
    };

    //deleting source
    const onDeleteSource = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteSource: SourceDataType = await new ApiClient().delete('sources/' + singleSource.id);
        if (Object.keys(deleteSource).length === 0) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setDeleteModal({ open: false }));
        dispatch(setFetching(false));
    };

    //search source
    const handleSearchSource = () => {
        const searchSourceData = data?.filter((source: SourceDataType) => {
            return (
                source.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                source.name.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                source.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchSourceData);
        setRecordsData(searchSourceData);
    };

    return (
        <div>
            <PageHeadingSection description="Identify and categorize lead sources. Update descriptions. Add or remove source channels." heading="Track Leads" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                <div className="flex-1">
                    <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                        <Plus />
                        Add New Source
                    </button>
                </div>
                <div className="relative  flex-1">
                    <input type="text" placeholder="Find A Source" className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]" onChange={(e) => setSearchInputText(e.target.value)} value={searchQuery} />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={handleSearchSource}>
                        Search
                    </button>
                </div>
            </div>

            {/* source List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'name',
                            title: 'Source Name',
                            sortable: true,
                            render: ({ name }) => <div>{name}</div>,
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
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => dispatch(setEditModal({ id, open: true }))}>
                                            <Edit />
                                        </button>
                                    </Tippy>
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => dispatch(setDeleteModal({ id, open: true }))}>
                                            <Delete />
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

            {/* edit modal */}
            <SourceEditModal />

            {/* view modal */}
            <SourceViewModal />

            {/* delete modal */}
            <ConfirmationModal
                open={deleteModal}
                onClose={() => dispatch(setDeleteModal({ open: false }))}
                onDiscard={() => dispatch(setDeleteModal({ open: false }))}
                description={<>Are you sure you want to delete this Source? It will also remove form database.</>}
                title="Delete task priority"
                isBtnDisabled={isBtnDisabled}
                onSubmit={onDeleteSource}
                btnSubmitText="Delete"
            />

            {/* create modal */}
            <SourceCreateModal />
        </div>
    );
};

export default Source;

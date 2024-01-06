/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BranchDataType, GetMethodResponseType } from '@/utils/Types';
import { getAllBranches, setBranchDataLength, setCreateModal, setDeleteModal, setDisableBtn, setEditModal, setFetching, setViewModal } from '@/store/Slices/branchSlice';
import BranchViewModal from '@/components/Branches/BranchViewModal';
import { IRootState } from '@/store';
import { ApiClient } from '@/utils/http';
import BranchCreateModal from '@/components/Branches/BranchCreateModal';
import BranchEditModal from '@/components/Branches/BranchEditModal';
import Loader from '@/components/__Shared/Loader';

const BranchPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Organize Offices | Branches'));
    }, []);

    //hooks
    const { data, isFetching, isBtnDisabled, deleteModal, singleData, isAbleToCreate, isAbleToDelete, isAbleToUpdate, isAbleToRead, totalRecords } = useSelector((state: IRootState) => state.branch);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<BranchDataType[]>([] as BranchDataType[]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    useEffect(() => {
        const data = sortBy(recordsData, sortStatus.columnAccessor);
        setRecordsData(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);
    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(search);

    //get all branch after page render
    useEffect(() => {
        getBranchList();
    }, [isFetching, page, pageSize, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all Branch list
    const getBranchList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`branch?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        const branches: BranchDataType[] = res?.data;
        if (typeof branches === 'undefined') {
            dispatch(getAllBranches([] as BranchDataType[]));
            return;
        }
        dispatch(getAllBranches(branches));
        dispatch(setBranchDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    //deleting branch
    const onDeleteBranch = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deleteBranch: BranchDataType = await new ApiClient().delete('branch/' + singleData.id);
        if (deleteBranch === null) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setDeleteModal({ open: false }));
        dispatch(setFetching(false));
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

    return !isAbleToRead ? null : (
        <div>
            <PageHeadingSection description="List company branches. Add new locations. Update details. Remove obsolete branches." heading="Organize Offices" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {isAbleToCreate ? (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[200px] max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                            <Plus />
                            Add New Branch
                        </button>
                    </div>
                ) : (
                    <div className="flex-1"></div>
                )}

                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Find A Branch"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* Branch List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    fetching={loading}
                    columns={[
                        {
                            accessor: 'srNo',
                            title: '#',
                            width: 40,
                            render: ({ srNo }) => srNo,
                        },
                        {
                            accessor: 'name',
                            title: 'Branch Name',
                            sortable: true,
                            render: ({ name }) => <div>{name}</div>,
                        },
                        {
                            accessor: 'country',
                            title: 'Country',
                            sortable: true,
                            render: ({ country }) => <div>{country}</div>,
                        },
                        {
                            accessor: 'state',
                            title: 'State',
                            sortable: true,
                            render: ({ state }) => <div>{state}</div>,
                        },
                        {
                            accessor: 'city',
                            title: 'City',
                            sortable: true,
                            render: ({ city }) => <div>{city}</div>,
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
                            title: 'Action',
                            titleClassName: '!text-center',
                            render: ({ id }) => (
                                <div className="flex justify-center gap-2 p-3 text-center">
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
                />
            </div>
            {/* edit modal */}
            <BranchEditModal />

            {/* view modal */}
            <BranchViewModal />

            {/* delete modal */}
            <ConfirmationModal
                open={deleteModal}
                onClose={() => dispatch(setDeleteModal({ open: false }))}
                onDiscard={() => dispatch(setDeleteModal({ open: false }))}
                description={isFetching ? <Loader /> : <>Are you sure you want to delete this Branch? It will also remove form database.</>}
                title="Delete Branch"
                isBtnDisabled={isBtnDisabled}
                onSubmit={onDeleteBranch}
                btnSubmitText="Delete"
            />

            {/* create modal */}
            <BranchCreateModal />
        </div>
    );
};

export default BranchPage;

//

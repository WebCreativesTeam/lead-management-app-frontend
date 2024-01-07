/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { GetMethodResponseType, IProductColor } from '@/utils/Types';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { ApiClient } from '@/utils/http';
import { getAllProductColor, setCreateModal, setDeleteModal, setEditModal, setPage, setPageSize, setProductColorDataLength, setViewModal } from '@/store/Slices/productColorSlice';
import { IRootState } from '@/store';
import DeleteProductColorModal from '@/components/Product/Colors/DeleteProductColorModal';
import CreateProductColorModal from '@/components/Product/Colors/CreateProductColorModal';
import EditProductColorModal from '@/components/Product/Colors/EditProductColorModal';
import ViewProductColorModal from '@/components/Product/Colors/ViewProductColorModal';
import Link from 'next/link';
import { PAGE_SIZES } from '@/utils/contant';

const ProductColorPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Product Color Page'));
    });

    //hooks
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, totalRecords, pageSize, page } = useSelector((state: IRootState) => state.productColor);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable

    const [recordsData, setRecordsData] = useState<IProductColor[]>([] as IProductColor[]);
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

    //get all productColor after page render
    useEffect(() => {
        getProductColorList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all ProductColor list
    const getProductColorList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`color?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        const status: IProductColor[] = res?.data;
        if (typeof status === 'undefined') {
            dispatch(getAllProductColor([] as IProductColor[]));
            return;
        }
        dispatch(getAllProductColor(status));
        dispatch(setProductColorDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    return (
        <div>
            <PageHeadingSection description="create product colors. Monitor workflow. Update colors." heading="Product Colors" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {/* {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : ( */}
                <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                    <button className="btn btn-primary h-full w-full max-w-fit max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                        <Plus />
                        Add New Color
                    </button>
                    <Link className="btn btn-primary h-full w-full max-w-fit max-sm:mx-auto" href="/manage-products">
                        Manage Products
                    </Link>
                </div>
                {/* )} */}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find Color"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* product colors List table*/}
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
                            title: 'Color Name',
                            sortable: true,
                            render: ({ name, value }) => (
                                <span className={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: value, backgroundColor: value + '20' }}>
                                    {name}
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
            <EditProductColorModal />

            {/* view modal */}
            <ViewProductColorModal />

            {/* delete modal */}
            <DeleteProductColorModal />

            {/* create modal */}
            <CreateProductColorModal />
        </div>
    );
};

export default ProductColorPage;

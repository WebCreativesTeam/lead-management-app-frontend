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
import { GetMethodResponseType, IProduct, IProductColor, ProductColorSecondaryEndpointType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import { getAllProductColorForProduct, getAllProducts, setCreateModal, setDeleteModal, setEditModal, setProductDataLength, setViewModal } from '@/store/Slices/productSlice';
import ProductViewModal from '@/components/Product/ProductViewModal';
import ProductCreateModal from '@/components/Product/ProductCreateModal';
import ProductEditModal from '@/components/Product/ProductEditModal';
import ProductDeleteModal from '@/components/Product/ProductDeleteModal';
import Link from 'next/link';

const Product = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Track Leads | Products'));
    });
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, totalRecords } = useSelector((state: IRootState) => state.product);

    //hooks
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<IProduct[]>([] as IProduct[]);
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

    //get all product after page render
    useEffect(() => {
        getProductList();
    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    useEffect(() => {
        getAllProductColors();
    }, []);

    //get all Product list
    const getProductList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`product?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        const product: IProduct[] = res?.data;
        if (typeof product === 'undefined') {
            dispatch(getAllProducts([] as IProduct[]));
            return;
        }
        dispatch(getAllProducts(product));
        dispatch(setProductDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    //get all colors's list
    const getAllProductColors = async () => {
        setLoading(true);
        const colorsList: GetMethodResponseType = await new ApiClient().get('color/list');
        const colors: ProductColorSecondaryEndpointType[] = colorsList?.data;
        if (typeof colors === 'undefined') {
            dispatch(getAllProductColorForProduct([] as ProductColorSecondaryEndpointType[]));
            return;
        }
        dispatch(getAllProductColorForProduct(colors));
    };

    return (
        isAbleToRead && (
            <div>
                <PageHeadingSection description="Identify and categorize products. Update descriptions. Add or remove product." heading="Manage Products" />
                <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                        {isAbleToCreate && (
                            <button className="btn btn-primary h-full w-full max-w-fit max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                                <Plus />
                                Add New Product
                            </button>
                        )}
                        <Link className="btn btn-primary h-full w-full max-w-fit max-sm:mx-auto" href="/manage-products/product-colors">
                            Manage Colors
                        </Link>
                    </div>
                    {/* )} */}
                    <div className="relative  flex-1">
                        <input
                            type="text"
                            placeholder="Find A Product"
                            className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                            onChange={(e) => setSearchInputText(e.target.value)}
                            value={searchInputText}
                        />
                        <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                            Search
                        </button>
                    </div>
                </div>

                {/* product List table*/}
                <div className="datatables panel mt-6">
                    <DataTable
                        className="table-hover whitespace-nowrap"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'name',
                                title: 'Product Name',
                                sortable: true,
                                render: ({ name }) => <div>{name}</div>,
                            },
                            {
                                accessor: 'description',
                                title: 'Description',
                                sortable: true,
                                render: ({ description }) => <div>{description}</div>,
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
                <ProductEditModal />

                {/* view modal */}
                <ProductViewModal />

                {/* delete modal */}
                <ProductDeleteModal />

                {/* create modal */}
                <ProductCreateModal />
            </div>
        )
    );
};

export default Product;

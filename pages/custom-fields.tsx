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
import { GetMethodResponseType, ICustomField, IFiedlListType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import { getAllCustomField, setCreateModal, setDeleteModal, setEditModal, setCustomFieldDataLength, setViewModal, getAllFieldsList } from '@/store/Slices/customFieldSlice';
import CustomFieldViewModal from '@/components/CustomField/CustomFieldViewModal';
import CustomFieldCreateModal from '@/components/CustomField/CustomFieldsCreateModal';
import CustomFieldEditModal from '@/components/CustomField/CustomFieldEditModal';
import CustomFieldDeleteModal from '@/components/CustomField/CustomFieldsDeleteModal';
import ToggleSwitch from '@/components/__Shared/ToggleSwitch';

const CustomFields = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Custom Fields | Create custom fields'));
    }, []);
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate, totalRecords } = useSelector((state: IRootState) => state.customField);

    //hooks
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    //datatable
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<ICustomField[]>([] as ICustomField[]);
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

    //get all customField after page render
    useEffect(() => {
        getCustomFieldList();
        getFieldsList();

    }, [isFetching, pageSize, page, searchQuery]);

    useEffect(() => {
        setRecordsData(data);
    }, [data]);

    //get all CustomField list
    const getCustomFieldList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get(`custom-field?limit=${pageSize}&page=${page}&search=${searchQuery}`);
        const customField: ICustomField[] = res?.data;
        if (typeof customField === 'undefined') {
            dispatch(getAllCustomField([] as ICustomField[]));
            return;
        }
        dispatch(getAllCustomField(customField));
        dispatch(setCustomFieldDataLength(res?.meta?.totalCount));
        setLoading(false);
    };

    //get all field list : dropdown for create modal
    const getFieldsList = async () => {
        const res: GetMethodResponseType = await new ApiClient().get('custom-field/list');
        const fieldsList: IFiedlListType[] = res?.data;
        if (typeof fieldsList === 'undefined') {
            dispatch(getAllFieldsList([] as IFiedlListType[]));
            return;
        }
        dispatch(getAllFieldsList(fieldsList));
    };

    return (
        <div>
            <PageHeadingSection description="Create different type of field according to user preference." heading="Create Custom Fields" />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {/* {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : ( */}
                <div className="flex-1">
                    <button className="btn btn-primary h-full w-full max-w-fit max-sm:mx-auto" type="button" onClick={() => dispatch(setCreateModal(true))}>
                        <Plus />
                        Create Custom Field
                    </button>
                </div>
                {/* )} */}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find A CustomField"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={() => setSearch(searchInputText)}>
                        Search
                    </button>
                </div>
            </div>

            {/* customField List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'label',
                            title: 'Label Name',
                            sortable: true,
                            render: ({ label }) => <div>{label}</div>,
                        },
                        {
                            accessor: 'fieldType',
                            title: 'Field Type',
                            sortable: true,
                            render: ({ fieldType }) => <div>{fieldType}</div>,
                        },
                        {
                            accessor: 'order',
                            title: 'Order',
                            sortable: true,
                            render: ({ order }) => <div>{order}</div>,
                        },
                        {
                            accessor: 'active',
                            title: 'Active',
                            sortable: true,
                            render: ({ active }) => (
                                // isAbleToChangeDefaultStatus ? (
                                <div>
                                    <label className="relative h-6 w-12">
                                        <input
                                            type="checkbox"
                                            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                            id="custom_switch_checkbox1"
                                            name="active"
                                            checked={active}
                                            onChange={
                                                (e: React.ChangeEvent<HTMLInputElement>) => null
                                                // dispatch(setDefaultStatusModal({ switchValue: e.target.checked, id, open: true }))
                                            }
                                        />
                                        <ToggleSwitch />
                                    </label>
                                </div>
                            ),
                            // ) : (
                            //     isDefault && (
                            //         <div>
                            //             <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">Default</span>
                            //         </div>
                            //     )
                            // ),
                        },
                        {
                            accessor: 'required',
                            title: 'Field Required',
                            sortable: true,
                            render: ({ required }) => (
                                <div>
                                    <span
                                        className={`mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-${required ? 'danger' : 'blue'}-800 dark:bg-${
                                            required ? 'danger' : 'blue'
                                        }-900 dark:text-${required ? 'danger' : 'blue'}-300`}
                                    >
                                        {required ? 'Required' : 'Not Required'}
                                    </span>
                                </div>
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
            <CustomFieldEditModal />

            {/* view modal */}
            <CustomFieldViewModal />

            {/* delete modal */}
            <CustomFieldDeleteModal />

            {/* create modal */}
            <CustomFieldCreateModal />
        </div>
    );
};

export default CustomFields;

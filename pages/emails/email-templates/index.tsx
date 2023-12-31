/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';
import { Delete, Edit, Plus, View } from '@/utils/icons';
import PageHeadingSection from '@/components/__Shared/PageHeadingSection/index.';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { GetMethodResponseType, IEmailTemplate } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { IRootState } from '@/store';
import { getAllEmailTemplates, setDeleteModal, setViewModal } from '@/store/Slices/emailSlice/emailTemplateSlice';
import EmailDeleteModal from '@/components/emails/EmailTemplates/EmailTemplateDeleteModal';
import { useRouter } from 'next/router';
import EmailViewModal from '@/components/emails/EmailTemplates/EmailTemplateViewModal';

const EmailTemplates = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Email Templates | Emails'));
    });
    //hooks
    const { data, isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate } = useSelector((state: IRootState) => state.emailTemplate);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<IEmailTemplate[]>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
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

    //get all emails after page render
    useEffect(() => {
        getEmailList();
    }, [isFetching]);

    useEffect(() => {
        setSearchedData(data);
        setInitialRecords(data);
    }, [data]);

    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);
    //get all emails list
    const getEmailList = async () => {
        setLoading(true);
        const res: GetMethodResponseType = await new ApiClient().get('email-template');
        const emails: IEmailTemplate[] = res?.data;
        if (typeof emails === 'undefined') {
            dispatch(getAllEmailTemplates([] as IEmailTemplate[]));
            return;
        }
        dispatch(getAllEmailTemplates(emails));
        setLoading(false);
    };

    //search emails
    const handleSearchEmail = () => {
        const searchEmailData = data?.filter((email: IEmailTemplate) => {
            return (
                email.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim(), 0) ||
                email.name.toLowerCase().endsWith(searchQuery.toLowerCase().trim()) ||
                email.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
        });
        setSearchedData(searchEmailData);
        setRecordsData(searchEmailData);
    };

    return !isAbleToRead ? null : (
        <div>
            <PageHeadingSection
                description=" Design and save new email templates for various purposes.Modify existing email templates to match your current needs. Remove outdated or unused email templates from your collection."
                heading="Email Templates"
            />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                {!isAbleToCreate ? (
                    <div className="flex-1"></div>
                ) : (
                    <div className="flex-1">
                        <button className="btn btn-primary h-full w-full max-w-[250px] max-sm:mx-auto" type="button" onClick={() => router.push('/emails/email-templates/create-email-template')}>
                            <Plus />
                            Create New Template
                        </button>
                    </div>
                )}
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find Email Templates"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" onClick={handleSearchEmail}>
                        Search
                    </button>
                </div>
            </div>

            {/* Emails List table*/}
            <div className="datatables panel mt-6">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'name',
                            title: 'Template Name',
                            sortable: true,
                            render: ({ name }) => <div>{name}</div>,
                        },
                        {
                            accessor: 'subject',
                            title: 'Subject',
                            sortable: true,
                            render: ({ subject }) => <div>{subject}</div>,
                        },
                        {
                            accessor: 'message',
                            title: 'Template Body',
                            sortable: true,
                            render: ({ message }) => <div dangerouslySetInnerHTML={{ __html: message.slice(0, 30) }}></div>,
                        },
                        {
                            accessor: 'createdAt',
                            title: 'Created Date',
                            sortable: true,
                            render: ({ createdAt }) => <div>{new Date(createdAt).toLocaleString()}</div>,
                        },
                        {
                            accessor: 'updatedAt',
                            title: 'Updated Date',
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
                                            <button type="button" onClick={() => router.push('/emails/email-templates/edit-email-template/' + id)}>
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

            {/* view modal */}
            <EmailViewModal />

            {/* delete modal */}
            <EmailDeleteModal />
        </div>
    );
};

export default EmailTemplates;

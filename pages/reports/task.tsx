/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useDeferredValue } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Chart from '@/components/Charts/chart'
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

const tasks = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Task Reports | Reports'));
    });
    //hooks
    // const { isFetching, isAbleToCreate, isAbleToDelete, isAbleToRead, isAbleToUpdate } = useSelector((state: IRootState) => state.emailTemplate);
    const [searchInputText, setSearchInputText] = useState<string>('');
    const [searchedData, setSearchedData] = useState<IEmailTemplate[]>();
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




    //useDefferedValue hook for search query
    const searchQuery = useDeferredValue(searchInputText);

    
        //Values for chart
    const values: any = {
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '16px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                            },
                            total: {
                                show: true,
                                label: 'All Tasks',
                                color: '#888ea8',
                                fontSize: '16px',

                            },
                        },
                    },
                },
            },
            labels: ['Task 1', 'Task 1', 'Task 1'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };


    return  (
        <div>
            <PageHeadingSection
                description="Assign Tasks to Users"
                heading="Task Reports"
            />
            <div className="my-6 flex flex-col gap-5 sm:flex-row ">
                <div className="relative  flex-1">
                    <input
                        type="text"
                        placeholder="Find Tasks"
                        className="form-input py-3 ltr:pr-[100px] rtl:pl-[100px]"
                        onChange={(e) => setSearchInputText(e.target.value)}
                        value={searchInputText}
                    />
                    <button type="button" className="btn btn-primary absolute top-1 shadow-none ltr:right-1 rtl:left-1" >
                        Search
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center  gap-y-4 flex-wrap gap-x-2  lg:gap-x-10 md:gap-x-4 md:items-start md:justify-start">

            {[...Array(10)].map((x, i) =>{
            return <Chart data={values} key={i}/>
            })}
        </div>
        </div>
    );
};

export default tasks;

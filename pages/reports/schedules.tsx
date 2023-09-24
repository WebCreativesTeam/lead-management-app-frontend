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
import Calendar from '@/components/Calender/calender';





const schedules = () => {


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
 

  return (
    <div>
    <Calendar />

</div>
  )
}

export default schedules
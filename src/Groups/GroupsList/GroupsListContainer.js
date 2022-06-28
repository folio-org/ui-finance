import React from 'react';

import {
  RESULT_COUNT_INCREMENT,
  usePagination,
} from '@folio/stripes-acq-components';

import GroupsList from './GroupsList';
import { useGroups } from './hooks';

const resetData = () => {};

const GroupsListContainer = () => {
  const {
    pagination,
    changePage,
    refreshPage,
  } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const {
    groups,
    totalRecords,
    isFetching,
  } = useGroups({ pagination });

  return (
    <GroupsList
      onNeedMoreData={changePage}
      resetData={resetData}
      groupsCount={totalRecords}
      isLoading={isFetching}
      groups={groups}
      pagination={pagination}
      refreshList={refreshPage}
    />
  );
};

export default GroupsListContainer;

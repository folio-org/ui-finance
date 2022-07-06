import React from 'react';

import {
  RESULT_COUNT_INCREMENT,
  usePagination,
} from '@folio/stripes-acq-components';

import FiscalYearsList from './FiscalYearsList';
import { useFiscalYears } from './hooks';

const resetData = () => { };

const FiscalYearsListContainer = () => {
  const {
    pagination,
    changePage,
    refreshPage,
  } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const {
    fiscalYears,
    totalRecords,
    isFetching,
  } = useFiscalYears({ pagination });

  return (
    <FiscalYearsList
      onNeedMoreData={changePage}
      resetData={resetData}
      fiscalYearsCount={totalRecords}
      isLoading={isFetching}
      fiscalYears={fiscalYears}
      pagination={pagination}
      refreshList={refreshPage}
    />
  );
};

export default FiscalYearsListContainer;

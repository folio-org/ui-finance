import {
  RESULT_COUNT_INCREMENT,
  usePagination,
} from '@folio/stripes-acq-components';
import { useLedgers } from './hooks';

import LedgersList from './LedgersList';

const resetData = () => {};

export const LedgerListContainer = () => {
  const {
    pagination,
    changePage,
  } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });

  const {
    ledgers,
    totalRecords,
    isFetching,
  } = useLedgers({ pagination });

  return (
    <LedgersList
      onNeedMoreData={changePage}
      resetData={resetData}
      ledgersCount={totalRecords}
      isLoading={isFetching}
      ledgers={ledgers}
      pagination={pagination}
    />
  );
};

export default LedgerListContainer;

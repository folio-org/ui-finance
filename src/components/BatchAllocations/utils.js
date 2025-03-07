import isFinite from 'lodash/isFinite';

import { exportToCsv } from '@folio/stripes/components';

import { BATCH_ALLOCATION_ROUTES_DICT } from '../../common/const';
import { BATCH_ALLOCATION_COLUMNS } from './constants';

export const getBatchAllocationColumnMapping = ({ intl }) => {
  return BATCH_ALLOCATION_COLUMNS.reduce((acc, column) => {
    return { ...acc, [column]: intl.formatMessage({ id: `ui-finance.transaction.allocation.batch.columns.${column}` }) };
  }, {});
};

export const exportCsvBatchAllocationLog = (batchAllocationLog, intl) => {
  const filename = `${batchAllocationLog.jobName.replace(/\.csv$/, '')}-log`;
  const exportData = batchAllocationLog.financeData?.map(data => ({
    ...data,
    transactionTag: data.transactionTag?.tagList?.join(', '),
  }));

  return exportToCsv(
    [
      getBatchAllocationColumnMapping({ intl }),
      ...(exportData || []),
    ],
    {
      header: false,
      filename,
    },
  );
};

export const resolveDefaultBackPathname = (sourceType, sourceId) => {
  const pathname = `${BATCH_ALLOCATION_ROUTES_DICT[sourceType]}/${sourceId}/view`;

  return pathname;
};

export const dehydrateAllocationLog = log => ({
  ...log,
  financeData: (log?.jobDetails?.fyFinanceData || [])
    .filter(({ isBudgetChanged, isFundChanged }) => isBudgetChanged || isFundChanged),
});

export const parseNumberOrInitial = (value) => (value && (isFinite(Number(value)) ? Number(value) : value));

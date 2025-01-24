import { useMemo } from 'react';

import { getFormattedOptions } from '../../../common/utils';
import { BATCH_ALLOCATION_COLUMNS } from './constants';
import { FUND_STATUSES_OPTIONS } from '../../../Funds/constants';

export const getBatchAllocationColumnMapping = ({ intl }) => {
  return BATCH_ALLOCATION_COLUMNS.reduce((acc, column) => {
    return { ...acc, [column]: intl.formatMessage({ id: `ui-finance.transaction.allocation.batch.columns.${column}` }) };
  }, {});
};

export const useBatchAllocationColumnValues = ({ budgetsFunds, intl }) => {
  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, FUND_STATUSES_OPTIONS), [intl]);

  return budgetsFunds.map((fund) => ({
    ...fund,
    fundStatus: <span>Select component</span>,
  }));
};

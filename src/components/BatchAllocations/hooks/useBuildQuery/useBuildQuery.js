import { useCallback } from 'react';

import {
  buildArrayFieldQuery,
  buildDateTimeRangeQuery,
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { getKeywordQuery } from '../../BatchAllocationLogs/BatchAllocationLogsSearchConfig';
import { FILTERS } from '../../BatchAllocationLogs/constants';

export const useBuildQuery = () => {
  return useCallback(makeQueryBuilder(
    'cql.allRecords=1',
    (query, qindex) => {
      if (qindex) {
        return `(${qindex}=${query}*)`;
      }

      return `(${getKeywordQuery(query)})`;
    },
    'sortby metadata.createdDate/sort.descending',
    {
      [FILTERS.DATE]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE]),
      [FILTERS.FISCAL_YEAR]: buildArrayFieldQuery.bind(null, [FILTERS.FISCAL_YEAR]),
      [FILTERS.GROUP]: buildArrayFieldQuery.bind(null, [FILTERS.GROUP]),
      [FILTERS.LEDGER]: buildArrayFieldQuery.bind(null, [FILTERS.LEDGER]),
      [FILTERS.USER]: buildArrayFieldQuery.bind(null, [FILTERS.USER]),
    },
  ), []);
};

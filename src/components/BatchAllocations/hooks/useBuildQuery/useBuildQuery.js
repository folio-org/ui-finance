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
      [FILTERS.FISCAL_YEAR]: (filterValue) => `jobDetails =/@${FILTERS.FISCAL_YEAR} (${Array.isArray(filterValue) ? filterValue.join(' or ') : filterValue})`,
      [FILTERS.LEDGER]: (filterValue) => `jobDetails =/@${FILTERS.LEDGER} (${Array.isArray(filterValue) ? filterValue.join(' or ') : filterValue})`,
      [FILTERS.GROUP]: (filterValue) => `jobDetails =/@${FILTERS.GROUP} (${Array.isArray(filterValue) ? filterValue.join(' or ') : filterValue})`,
      [FILTERS.USER]: buildArrayFieldQuery.bind(null, [FILTERS.USER]),
    },
  ), []);
};

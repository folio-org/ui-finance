import { useCallback } from 'react';

import {
  buildArrayFieldQuery,
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { getKeywordQuery } from '../../FiscalYearsListSearchConfig';
import { FISCAL_YEAR_FILTERS } from '../../../constants';

export const useBuildQuery = () => {
  return useCallback(makeQueryBuilder(
    'cql.allRecords=1',
    (query, qindex) => {
      if (qindex) {
        return `(${qindex}=${query}*)`;
      }

      return `(${getKeywordQuery(query)})`;
    },
    'sortby name/sort.ascending',
    {
      [FISCAL_YEAR_FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FISCAL_YEAR_FILTERS.ACQUISITIONS_UNIT]),
    },
  ), []);
};

import { useCallback } from 'react';

import {
  buildArrayFieldQuery,
  buildFilterQuery,
  connectQuery,
  buildSortingQuery,
} from '@folio/stripes-acq-components';

import { FILTERS } from '../../TransactionsFilters/TransactionsFilters';

const customFiltersMap = {
  [FILTERS.TAGS]: buildArrayFieldQuery.bind(null, [FILTERS.TAGS]),
};

const customSortingMap = {
  amount: 'amount/number',
};

export const useBuildQuery = () => {
  return useCallback((queryParams, budget) => {
    const requiredFilterQuery =
      `(fiscalYearId=${budget?.fiscalYearId} and (fromFundId=${budget?.fundId} or toFundId=${budget?.fundId}))`;
    const filterQuery = buildFilterQuery(queryParams, (query) => `(id=${query}* or amount=${query}*)`, customFiltersMap);

    return connectQuery(
      filterQuery ? `${requiredFilterQuery} and ${filterQuery}` : requiredFilterQuery,
      buildSortingQuery(queryParams, customSortingMap) || 'sortby metadata.createdDate/sort.descending',
    );
  }, []);
};

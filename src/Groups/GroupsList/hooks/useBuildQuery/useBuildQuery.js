import { useCallback } from 'react';

import {
  buildArrayFieldQuery,
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { getKeywordQuery } from '../../GroupsListSearchConfig';
import { GROUPS_FILTERS } from '../../../constants';

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
    { [GROUPS_FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [GROUPS_FILTERS.ACQUISITIONS_UNIT]) },
  ), []);
};

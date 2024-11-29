import chunk from 'lodash/chunk';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  getGroupLedgers,
  getLedgersCurrentFiscalYears,
} from '../../../Groups/GroupDetails/utils';
import { FISCAL_YEARS_API } from '../../const';

const DEFAULT_DATA = [];

export const useGroupUpcomingFiscalYears = (groupId, options = {}) => {
  const {
    enabled = true,
    ...queryOptions
  } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'group-upcoming-fiscal-years' });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, groupId],
    queryFn: async ({ signal }) => {
      const currentFiscalYears = await getGroupLedgers(ky)(groupId).then(({ ledgers }) => {
        return getLedgersCurrentFiscalYears(ky.extend({ signal }))(ledgers.map(({ id }) => id));
      });

      const results = await chunk(currentFiscalYears, 5)
        .reduce(async (acc, currentFYChunk) => {
          const resolvedData = await acc;

          const fiscalYearsSettled = await Promise.allSettled(currentFYChunk.map(({ series, periodStart }) => {
            const searchParams = {
              query: `groupFundFY.groupId=="${groupId}" and series=="${series}" and periodStart>="${periodStart}" sortby periodStart/sort.descending`,
              limit: LIMIT_MAX,
            };

            return ky.get(FISCAL_YEARS_API, { searchParams, signal }).json();
          }));

          const fiscalYears = fiscalYearsSettled
            .filter(({ status }) => status === 'fulfilled')
            .map(({ value }) => value)
            .filter(Boolean);

          return resolvedData.concat(fiscalYears);
        }, Promise.resolve([]));

      const aggregatedData = results.reduce((acc, current) => {
        acc.fiscalYears = acc.fiscalYears.concat(current.fiscalYears || []);
        acc.totalRecords += current.totalRecords || 0;

        return acc;
      }, { fiscalYears: [], totalRecords: 0 });

      aggregatedData.fiscalYears.sort((a, b) => {
        const periodStartDiff = new Date(b.periodStart) - new Date(a.periodStart); // Descending order

        if (periodStartDiff !== 0) return periodStartDiff;

        return a.series.localeCompare(b.series); // Ascending order
      });

      return aggregatedData;
    },
    enabled: Boolean(enabled && groupId),
    ...queryOptions,
  });

  return {
    fiscalYears: data?.fiscalYears || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  };
};

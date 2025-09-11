import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { batchRequest } from '@folio/stripes-acq-components';

import {
  GROUP_FUND_FISCAL_YEARS_API,
  GROUPS_API,
} from '../../common/const';
import { getLedgerGroupsSummary } from './utils';

const DEFAULT_DATA = [];

export const useRelatedGroups = (params = {}, options = {}) => {
  const {
    fiscalYearId,
    fundIds = [],
    ledgerId,
  } = params;

  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'related-groups' });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, tenantId, fundIds, fiscalYearId, ledgerId],
    queryFn: async ({ signal }) => {
      const groupFundFiscalYearsResponse = await batchRequest(
        async ({ params: searchParams }) => (
          ky.get(GROUP_FUND_FISCAL_YEARS_API, { searchParams, signal })
            .json()
            .then(({ groupFundFiscalYears }) => groupFundFiscalYears)
        ),
        fundIds,
        (itemsChunk) => {
          const query = itemsChunk
            .map(id => `fundId==${id}`)
            .join(' or ');

          return query || '';
        },
      );

      const groupIds = uniqBy(flatten(groupFundFiscalYearsResponse), 'groupId')
        .map(({ groupId }) => groupId);

      const relatedGroupsPromise = batchRequest(
        async ({ params: searchParams }) => (
          ky.get(GROUPS_API, { searchParams, signal })
            .json()
            .then(({ groups }) => groups)
        ),
        groupIds,
        (itemsChunk) => {
          const query = itemsChunk
            .map(id => `id==${id}`)
            .join(' or ');

          return query ? `${query} sortby name` : '';
        },
      );
      const ledgerGroupSummariesPromise = getLedgerGroupsSummary(
        ky.extend({ signal }),
        ledgerId,
        fiscalYearId,
      );

      const [
        relatedGroups,
        ledgerGroupSummaries,
      ] = await Promise.all([relatedGroupsPromise, ledgerGroupSummariesPromise]);

      return relatedGroups.map(relatedGroup => ({
        ...relatedGroup,
        ...(ledgerGroupSummaries[relatedGroup.id] || {}),
      }));
    },
    enabled,
    ...queryOptions,
  });

  return ({
    groups: data || DEFAULT_DATA,
    totalRecords: data?.length,
    ...rest,
  });
};

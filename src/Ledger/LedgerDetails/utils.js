import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { GROUP_SUMMARIES_API } from '../../common/const';

export const getLedgerGroupsSummary = (ky, ledgerId, fiscalYearId) => {
  if (!fiscalYearId) {
    return Promise.resolve([]);
  }

  const searchParams = {
    limit: LIMIT_MAX,
    query: `ledger.id==${ledgerId} and fiscalYearId==${fiscalYearId}`,
  };

  return ky.get(GROUP_SUMMARIES_API, { searchParams })
    .json()
    .then(({ groupFiscalYearSummaries }) => {
      return groupFiscalYearSummaries.reduce((acc, lgs) => {
        acc[lgs.groupId] = {
          allocated: lgs.allocated,
          unavailable: lgs.unavailable,
          available: lgs.available,
        };

        return acc;
      }, {});
    });
};

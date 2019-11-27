import { LIMIT_MAX } from '@folio/stripes-acq-components';

// eslint-disable-next-line import/prefer-default-export
export const getLedgerGroupsSummary = (ledgerGroupsSummaryMutator, ledgerId, fiscalYearId) => {
  if (!fiscalYearId) {
    return Promise.resolve([]);
  }

  return ledgerGroupsSummaryMutator.GET({
    params: {
      limit: LIMIT_MAX,
      query: `ledger.id==${ledgerId} and fiscalYearId==${fiscalYearId}`,
    },
  })
    .then(ledgerGroupSummaries => {
      return ledgerGroupSummaries.reduce((acc, lgs) => {
        acc[lgs.groupId] = {
          allocated: lgs.allocated,
          unavailable: lgs.unavailable,
          available: lgs.available,
        };

        return acc;
      }, {});
    });
};

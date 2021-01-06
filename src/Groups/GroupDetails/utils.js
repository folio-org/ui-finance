import { LIMIT_MAX } from '@folio/stripes-acq-components';

export const getGroupSummary = (groupSummariesMutator, groupId, fiscalYearId) => {
  if (!fiscalYearId) {
    return Promise.resolve({});
  }

  return groupSummariesMutator.GET({
    params: {
      limit: `${LIMIT_MAX}`,
      query: `(groupFundFY.groupId==${groupId} or groupId==${groupId}) and fiscalYearId==${fiscalYearId}`,
    },
  })
    .then(groupSummaries => {
      return groupSummaries[0] || {};
    });
};

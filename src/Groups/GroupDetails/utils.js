const emptyGroupSummary = {
  allocated: 0,
  unavailable: 0,
  available: 0,
};

// eslint-disable-next-line import/prefer-default-export
export const getGroupSummary = (groupSummariesMutator, groupId, fiscalYearId) => {
  if (!fiscalYearId) {
    return Promise.resolve(emptyGroupSummary);
  }

  return groupSummariesMutator.GET({
    params: {
      query: `(groupFundFY.groupId==${groupId} or groupId==${groupId}) and fiscalYearId==${fiscalYearId}`,
    },
  })
    .then(groupSummaries => {
      return groupSummaries[0] || emptyGroupSummary;
    });
};

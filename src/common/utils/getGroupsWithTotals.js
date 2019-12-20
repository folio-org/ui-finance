export const getGroupsWithTotals = (groups, groupSummaries) => {
  const groupSummariesMap = groupSummaries.reduce((acc, summary) => {
    acc[summary.groupId] = {
      allocated: summary.allocated,
      available: summary.available,
      unavailable: summary.unavailable,
    };

    return acc;
  }, {});

  return groups.map(group => {
    const groupSummary = groupSummariesMap[group.id] || {};

    return { ...group, ...groupSummary };
  });
};

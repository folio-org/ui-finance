const INITIAL_TOTALS = {
  allocated: 0,
  available: 0,
  unavailable: 0,
};

export const calculateTotals = (summaries = []) => {
  return summaries.reduce((totals, summary) => {
    return {
      allocated: totals.allocated + summary.allocated,
      available: totals.available + summary.available,
      unavailable: totals.unavailable + summary.unavailable,
    };
  }, INITIAL_TOTALS);
};

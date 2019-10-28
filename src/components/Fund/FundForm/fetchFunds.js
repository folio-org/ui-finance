export const fetchFundsByCode = (mutator, fundId, fundCode) => {
  if (!fundCode) return Promise.resolve([]);
  let query = `code=="${fundCode}"`;

  if (fundId) query += ` and id<>"${fundId}"`;

  return mutator.GET({ params: { query } });
};

export const fetchFundsByNameAndLedger = (mutator, fundId, fundName, ledgerId) => {
  if (!fundName || !ledgerId) return Promise.resolve([]);
  let query = `name=="${fundName}" and ledgerId=="${ledgerId}"`;

  if (fundId) query += ` and id<>"${fundId}"`;

  return mutator.GET({ params: { query } });
};

export const fetchFundsByName = (mutator, fundId, fundName, ledgerId) => {
  if (!fundName || !ledgerId) return Promise.resolve();
  let query = `name=="${fundName}" and ledgerId<>"${ledgerId}"`;

  if (fundId) query += ` and id<>"${fundId}"`;

  return mutator.GET({ params: { query } });
};

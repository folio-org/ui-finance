export const fetchFundsByName = (mutator, fundId, fundName, ledgerId) => {
  if (!fundName || !ledgerId) return Promise.resolve();
  let query = `name=="${fundName}" and ledgerId<>"${ledgerId}"`;

  if (fundId) query += ` and id<>"${fundId}"`;

  return mutator.GET({ params: { query } });
};

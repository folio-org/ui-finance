export const buildInitialValues = (fileData = [], financeData = []) => {
  const actualFundIdsSet = new Set(financeData.map((item) => item.fundId));
  const uploadedFundIdsSet = new Set(fileData.map((item) => item.fundId));

  const budgetsFunds = financeData.map((item) => {
    return {
      ...item,
      _isMissed: !uploadedFundIdsSet.has(item.fundId),
    };
  });

  const invalidFunds = fileData.filter((item) => !actualFundIdsSet.has(item.fundId));

  return {
    budgetsFunds,
    invalidFunds,
  };
};

import { groupBy } from 'lodash';

export const getFundsToDisplay = (funds, budgets) => {
  const groupedBudgetByFund = groupBy(budgets, 'fundId');

  return funds.map(fund => {
    const budget = groupedBudgetByFund[fund.id];

    if (!budget) return fund;

    const sum = budget.reduce((result, item) => {
      Object.keys(result).forEach(key => {
        if (item[key]) result[key] += item[key];
      });

      return result;
    }, { available: 0, allocated: 0, unavailable: 0 });

    return { ...sum, ...fund };
  });
};

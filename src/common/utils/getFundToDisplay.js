import { groupBy } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getFundsToDisplay = (funds, fundFiscalYears) => {
  const groupedFundFiscalYears = groupBy(fundFiscalYears, 'fundId');

  return funds.map(fund => {
    const groupFundFiscalYear = groupedFundFiscalYears[fund.id];

    if (!groupFundFiscalYear) return fund;

    const sum = groupFundFiscalYear.reduce((result, item) => {
      Object.keys(result).forEach(key => {
        if (item[key]) result[key] += item[key];
      });

      return result;
    }, { available: 0, allocated: 0, unavailable: 0 });

    return { ...sum, ...fund };
  });
};

import queryString from 'query-string';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useBuildQuery } from './useBuildQuery';

const budget = {
  fiscalYearId: 'fyId',
  fundId: 'fundId',
};

describe('useBuildQuery', () => {
  it('should return function, that return query', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current(queryString.parse('?foo=bar'), budget))
      .toBe(`((fiscalYearId=${budget.fiscalYearId} and (fromFundId=${budget.fundId} or toFundId=${budget.fundId})) and foo=="bar") sortby transactionDate/sort.descending`);
  });
});

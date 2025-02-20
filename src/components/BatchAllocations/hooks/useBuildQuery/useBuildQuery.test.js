import queryString from 'query-string';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useBuildQuery } from './useBuildQuery';

const quesries = {
  fiscalYearId: '1',
  groupId: '2',
  ledgerId: '3',
};

describe('useBuildQuery', () => {
  it('should return function, that return query', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current(queryString.parse('?foo=bar'))).toBe('(foo=="bar") sortby metadata.createdDate/sort.descending');
  });

  it('should return function, that return group query', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current(queryString.parse(`?groupId=${quesries.groupId}`)))
      .toBe(`(jobDetails =/@groupId (${quesries.groupId})) sortby metadata.createdDate/sort.descending`);
  });

  it('should return function, that return fiscalYear query', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current(queryString.parse(`?fiscalYearId=${quesries.fiscalYearId}`)))
      .toBe(`(jobDetails =/@fiscalYearId (${quesries.fiscalYearId})) sortby metadata.createdDate/sort.descending`);
  });

  it('should return function, that return ledger query', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current(queryString.parse(`?ledgerId=${quesries.ledgerId}`)))
      .toBe(`(jobDetails =/@ledgerId (${quesries.ledgerId})) sortby metadata.createdDate/sort.descending`);
  });
});

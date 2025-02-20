import queryString from 'query-string';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useBuildQuery } from './useBuildQuery';

describe('useBuildQuery', () => {
  it('should return function, that return query', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current(queryString.parse('?foo=bar'))).toBe('(foo=="bar") sortby metadata.createdDate/sort.descending');
  });
});

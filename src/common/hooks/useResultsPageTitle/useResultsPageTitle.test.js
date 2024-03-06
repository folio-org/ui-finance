import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { SEARCH_PARAMETER } from '@folio/stripes-acq-components';

import { useResultsPageTitle } from './useResultsPageTitle';

describe('useResultsPageTitle', () => {
  it('should return `null` if there is no active search query', () => {
    const { result } = renderHook(() => useResultsPageTitle({}));

    expect(result.current).toBeNull();
  });

  it('should return document title for the results page', () => {
    const { result } = renderHook(() => useResultsPageTitle({ [SEARCH_PARAMETER]: 'qwerty' }));

    expect(result.current).toBe('ui-finance.document.title.search');
  });
});

import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  NAVIGATION_SETTINGS_BROWSE_TAB_KEY,
  NAVIGATION_SETTINGS_SCOPE,
  useNavigationSettings,
} from './useNavigationSettings';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockGet = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue({ items: [] }),
});

describe('useNavigationSettings', () => {
  beforeEach(() => {
    queryClient.clear();
    useOkapiKy.mockClear().mockReturnValue({ get: mockGet });
  });

  it('should request settings entries with the finance navigation scope and key', async () => {
    renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(mockGet).toHaveBeenCalled());

    expect(mockGet).toHaveBeenCalledWith('settings/entries', expect.objectContaining({
      searchParams: {
        query: `(scope=="${NAVIGATION_SETTINGS_SCOPE}" and key=="${NAVIGATION_SETTINGS_BROWSE_TAB_KEY}")`,
      },
    }));
  });

  it('should return isBrowseTabEnabled false when no settings entry exists', async () => {
    const { result } = renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.isBrowseTabEnabled).toBe(false);
    expect(result.current.navigationSettingsEntry).toBeUndefined();
  });

  it('should return isBrowseTabEnabled true when a settings entry with value true exists', async () => {
    const entry = { id: 'settings-id', value: true };

    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue({ items: [entry] }),
    });

    const { result } = renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(result.current.navigationSettingsEntry).toEqual(entry));

    expect(result.current.isBrowseTabEnabled).toBe(true);
  });
});

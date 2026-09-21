import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { act, renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { SETTINGS_API } from '../../const';
import {
  BROWSE_TAB_ENABLED_SETTING_KEY,
  useNavigationSettings,
} from './useNavigationSettings';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const emptyCollection = { settings: [], totalRecords: 0 };

const mockGet = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue(emptyCollection),
});
const mockPost = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue({ id: 'settings-id', key: BROWSE_TAB_ENABLED_SETTING_KEY, value: 'true' }),
});
const mockPut = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue({}),
});

describe('useNavigationSettings', () => {
  beforeEach(() => {
    queryClient.clear();
    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue(emptyCollection),
    });
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
      post: mockPost,
      put: mockPut,
    });
  });

  it('should request the browse tab setting from finance-storage settings', async () => {
    renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith(
      SETTINGS_API,
      expect.objectContaining({
        searchParams: { query: `key=="${BROWSE_TAB_ENABLED_SETTING_KEY}"` },
        signal: expect.anything(),
      }),
    ));
  });

  it('should return isBrowseTabEnabled false when no settings entry exists', async () => {
    const { result } = renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.isBrowseTabEnabled).toBe(false);
    expect(result.current.navigationSettingsEntry).toBeUndefined();
  });

  it('should return isBrowseTabEnabled true when a settings entry with value "true" exists', async () => {
    const entry = { id: 'settings-id', key: BROWSE_TAB_ENABLED_SETTING_KEY, value: 'true' };

    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue({ settings: [entry], totalRecords: 1 }),
    });

    const { result } = renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(result.current.navigationSettingsEntry).toEqual(entry));

    expect(result.current.isBrowseTabEnabled).toBe(true);
  });

  it('should create a new settings entry via POST when none exists yet', async () => {
    const { result } = renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    await act(async () => {
      await result.current.saveNavigationSettings(true);
    });

    expect(mockPost).toHaveBeenCalledWith(
      SETTINGS_API,
      { json: { key: BROWSE_TAB_ENABLED_SETTING_KEY, value: 'true' } },
    );
  });

  it('should update the existing settings entry via PUT when one already exists, preserving _version for optimistic locking', async () => {
    const entry = {
      id: 'settings-id',
      key: BROWSE_TAB_ENABLED_SETTING_KEY,
      value: 'true',
      _version: 3,
      metadata: { updatedDate: '2026-01-01T00:00:00.000+0000' },
    };

    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue({ settings: [entry], totalRecords: 1 }),
    });

    const { result } = renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(result.current.navigationSettingsEntry).toEqual(entry));

    await act(async () => {
      await result.current.saveNavigationSettings(false);
    });

    expect(mockPut).toHaveBeenCalledWith(
      `${SETTINGS_API}/settings-id`,
      { json: { ...entry, value: 'false' } },
    );
  });
});

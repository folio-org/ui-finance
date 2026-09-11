import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { act, renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { NAVIGATION_SETTINGS_API } from '../../const';
import { useNavigationSettings } from './useNavigationSettings';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockGet = jest.fn().mockReturnValue({
  json: jest.fn().mockRejectedValue(new Error('Not Found')),
});
const mockPost = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue({ id: 'settings-id', enableBrowseTab: true }),
});
const mockPut = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue({}),
});

describe('useNavigationSettings', () => {
  beforeEach(() => {
    queryClient.clear();
    mockGet.mockReturnValue({
      json: jest.fn().mockRejectedValue(new Error('Not Found')),
    });
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
      post: mockPost,
      put: mockPut,
    });
  });

  it('should request navigation settings from finance-storage', async () => {
    renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith(
      NAVIGATION_SETTINGS_API,
      expect.objectContaining({ signal: expect.anything() }),
    ));
  });

  it('should return isBrowseTabEnabled false when no settings entry exists', async () => {
    const { result } = renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.isBrowseTabEnabled).toBe(false);
    expect(result.current.navigationSettingsEntry).toBeUndefined();
  });

  it('should return isBrowseTabEnabled true when a settings entry with enableBrowseTab true exists', async () => {
    const entry = { id: 'settings-id', enableBrowseTab: true };

    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue(entry),
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
      NAVIGATION_SETTINGS_API,
      { json: expect.objectContaining({ enableBrowseTab: true }) },
    );
  });

  it('should update the existing settings entry via PUT when one already exists', async () => {
    const entry = { id: 'settings-id', enableBrowseTab: true };

    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue(entry),
    });

    const { result } = renderHook(() => useNavigationSettings(), { wrapper });

    await waitFor(() => expect(result.current.navigationSettingsEntry).toEqual(entry));

    await act(async () => {
      await result.current.saveNavigationSettings(false);
    });

    expect(mockPut).toHaveBeenCalledWith(
      `${NAVIGATION_SETTINGS_API}/settings-id`,
      { json: { id: 'settings-id', enableBrowseTab: false } },
    );
  });
});

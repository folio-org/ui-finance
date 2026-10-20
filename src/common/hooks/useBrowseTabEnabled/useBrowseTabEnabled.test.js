import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useNavigationSettings } from '../useNavigationSettings';
import { useBrowseTabEnabled } from './useBrowseTabEnabled';

jest.mock('../useNavigationSettings', () => ({
  useNavigationSettings: jest.fn(),
}));

describe('useBrowseTabEnabled', () => {
  it('should return true when the setting is enabled', () => {
    useNavigationSettings.mockReturnValue({ navigationSettings: { enabled: true }, isLoading: false });

    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toEqual({ isBrowseTabEnabled: true, isLoading: false });
  });

  it('should return false when the setting is disabled', () => {
    useNavigationSettings.mockReturnValue({ navigationSettings: { enabled: false }, isLoading: false });

    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current.isBrowseTabEnabled).toBe(false);
  });

  it('should return false while the setting is loading', () => {
    useNavigationSettings.mockReturnValue({ navigationSettings: undefined, isLoading: true });

    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toEqual({ isBrowseTabEnabled: false, isLoading: true });
  });
});

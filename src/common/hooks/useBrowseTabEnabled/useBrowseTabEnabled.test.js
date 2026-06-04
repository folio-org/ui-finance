import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import useBrowseTabEnabled from './useBrowseTabEnabled';

const BROWSE_TAB_STORAGE_KEY = 'ui-finance-browse-tab-enabled';

describe('useBrowseTabEnabled', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('should return false when localStorage is empty', () => {
    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toBe(false);
  });

  it('should return true when localStorage has enabled=true', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, JSON.stringify({ enabled: true }));

    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toBe(true);
  });

  it('should return false when localStorage has enabled=false', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, JSON.stringify({ enabled: false }));

    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toBe(false);
  });

  it('should return false when localStorage has invalid JSON', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, 'not-valid-json');

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should return false when stored object has no "enabled" key', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, JSON.stringify({ other: 'value' }));

    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toBe(false);
  });

  it('should update when custom "browse-tab-settings-changed" event fires', () => {
    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(
        new CustomEvent('browse-tab-settings-changed', {
          detail: { enabled: true },
        }),
      );
    });

    expect(result.current).toBe(true);
  });

  it('should update to false when custom event has enabled=false', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, JSON.stringify({ enabled: true }));

    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(
        new CustomEvent('browse-tab-settings-changed', {
          detail: { enabled: false },
        }),
      );
    });

    expect(result.current).toBe(false);
  });

  it('should handle custom event with missing detail gracefully', () => {
    const { result } = renderHook(() => useBrowseTabEnabled());

    act(() => {
      window.dispatchEvent(
        new CustomEvent('browse-tab-settings-changed', {
          detail: null,
        }),
      );
    });

    expect(result.current).toBe(false);
  });

  it('should respond to cross-tab "storage" events for the correct key', () => {
    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toBe(false);

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: BROWSE_TAB_STORAGE_KEY,
        newValue: JSON.stringify({ enabled: true }),
      });

      window.dispatchEvent(storageEvent);
    });

    expect(result.current).toBe(true);
  });

  it('should ignore storage events for unrelated keys', () => {
    const { result } = renderHook(() => useBrowseTabEnabled());

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'some-other-key',
        newValue: JSON.stringify({ enabled: true }),
      });

      window.dispatchEvent(storageEvent);
    });

    expect(result.current).toBe(false);
  });

  it('should handle storage event with null newValue', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, JSON.stringify({ enabled: true }));

    const { result } = renderHook(() => useBrowseTabEnabled());

    expect(result.current).toBe(true);

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: BROWSE_TAB_STORAGE_KEY,
        newValue: null,
      });

      window.dispatchEvent(storageEvent);
    });

    expect(result.current).toBe(false);
  });

  it('should handle storage event with invalid JSON in newValue', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useBrowseTabEnabled());

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: BROWSE_TAB_STORAGE_KEY,
        newValue: 'bad-json',
      });

      window.dispatchEvent(storageEvent);
    });

    expect(result.current).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useBrowseTabEnabled());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('browse-tab-settings-changed', expect.any(Function));
  });
});

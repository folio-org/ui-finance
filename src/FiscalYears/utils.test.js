import { act, renderHook } from '@testing-library/react-hooks';

import { useSaveFiscalYear } from './utils';

describe('useSaveFiscalYear', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      POST: jest.fn(() => Promise.resolve()),
    };
  });

  it('should send POST request and close fiscal year form', () => {
    const { result } = renderHook(() => useSaveFiscalYear(mutator));

    const { saveFiscalYear } = result.current;

    act(() => {
      saveFiscalYear();
    });

    expect(mutator.POST).toHaveBeenCalled();
  });
});

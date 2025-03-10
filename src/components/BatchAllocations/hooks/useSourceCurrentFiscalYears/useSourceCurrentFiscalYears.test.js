import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { fetchSourceCurrentFiscalYears } from '../../utils';
import { useSourceCurrentFiscalYears } from './useSourceCurrentFiscalYears';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  fetchSourceCurrentFiscalYears: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useSourceCurrentFiscalYears', () => {
  const kyMock = jest.fn();
  const sourceType = 'type';
  const sourceId = 'id';
  const data = [{ id: 'fiscalYear1' }];

  beforeEach(() => {
    fetchSourceCurrentFiscalYears.mockReturnValue(() => Promise.resolve(data));
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return current fiscal years data', async () => {
    const { result } = renderHook(() => useSourceCurrentFiscalYears(sourceType, sourceId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.currentFiscalYears).toEqual(data);
  });
});

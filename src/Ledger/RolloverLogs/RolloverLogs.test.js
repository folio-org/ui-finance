import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { rolloverLogs } from '../../../test/jest/fixtures/rollover';
import { useRolloverLogs } from './hooks';
import { RolloverLogs } from './RolloverLogs';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));
jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
    ResetButton: () => <span>ResetButton</span>,
  };
});
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useRolloverLogs: jest.fn(),
}));

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderRolloverLogs = () => render(
  <RolloverLogs />,
  { wrapper },
);

describe('RolloverLogs', () => {
  beforeEach(() => {
    useRolloverLogs
      .mockClear()
      .mockReturnValue({
        rolloverLogs,
        totalRecords: rolloverLogs.length,
        isFetching: false,
        isLoading: false,
      });
  });

  it('should display filters', () => {
    renderRolloverLogs();

    expect(screen.getByText('stripes-acq-components.searchAndFilter')).toBeInTheDocument();
  });
});

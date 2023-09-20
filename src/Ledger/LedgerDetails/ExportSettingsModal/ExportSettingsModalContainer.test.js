import React from 'react';
import { Form } from 'react-final-form';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { useLedgerExportCSV } from './hooks';
import { ExportSettingsModalContainer } from './ExportSettingsModalContainer';

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useLedgerExportCSV: jest.fn(),
}));

const FY = {
  id: 'fyId',
  code: 'FY2022',
  series: 'FY',
};

const ledger = {
  id: 'ledgerId',
};

const defaultProps = {
  ledger,
  fiscalYear: FY,
  onCancel: jest.fn(),
};

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderExportSettingsModalContainer = (props = {}) => render(
  <Form
    onSubmit={jest.fn()}
    render={() => (
      <ExportSettingsModalContainer
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper },
);

const mockExportCSV = {
  isLoading: false,
  runExportCSV: jest.fn(() => Promise.resolve({})),
};

describe('ExportSettingsModalContainer', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    useLedgerExportCSV.mockClear().mockReturnValue(mockExportCSV);
  });

  it('should render Export Settings Modal', async () => {
    renderExportSettingsModalContainer();

    expect(screen.getByText('ui-finance.exportCSV.exportSettings.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.exportCSV.exportSettings.message')).toBeInTheDocument();
  });

  it('should call \'runExportCSV\' when \'Export\' button was clicked', async () => {
    renderExportSettingsModalContainer();

    await user.click(screen.getByText('ui-finance.exportCSV.exportSettings.export'));

    expect(mockExportCSV.runExportCSV).toHaveBeenCalled();
  });
});

import React from 'react';
import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import TransactionsFilters from './TransactionsFilters';

jest.useFakeTimers('modern');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ search: 'encumbrance.sourcePoLineId=456&sourceInvoiceId=456' })),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(() => ({})),
  stripesConnect: () => Component => props => <Component {...props} />,
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderTransactionFilters = (props = defaultProps) => (render(
  <TransactionsFilters
    {...props}
  />,
));

describe('TransactionsFilters component', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: jest.fn(() => ({
        json: () => Promise.resolve({
          invoices: [{ id: 'invoiceId', vendorInvoiceNo: '11111' }],
          poLines: [{ id: 'poLineId', poLineNumber: '10001' }],
        }),
      })),
    });
  });

  it('should display transaction list filters', async () => {
    await act(async () => {
      renderTransactionFilters();
    });

    expect(screen.getByText('ui-finance.transaction.type')).toBeDefined();
    expect(screen.getByText('ui-finance.transaction.source')).toBeDefined();
  });

  it('should apply filter when an option from selection was selected', async () => {
    await act(async () => {
      renderTransactionFilters();
    });

    const input = screen.getAllByLabelText('stripes-components.selection.filterOptionsLabel')[2];

    await act(async () => {
      user.type(input, '1');
      jest.advanceTimersByTime(1500);
    });

    user.click(screen.getByText(/11111/));

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });
});

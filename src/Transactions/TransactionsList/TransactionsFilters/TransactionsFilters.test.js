import React from 'react';
import { act, render, screen } from '@testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import TransactionsFilters from './TransactionsFilters';

jest.useFakeTimers('modern');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ search: 'encumbrance.sourcePoLineId=456&sourceInvoiceId=456' })),
}));
jest.mock('@folio/stripes-core/src/useOkapiKy', () => jest.fn(() => ({})));

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
          invoices: [{ id: 'invoiceId', vendorInvoiceNo: 'vendorInvoiceNo' }],
          poLines: [{ id: 'poLineId', poLineNumber: 'poLineNumber' }],
        }),
      })),
    });
  });

  it('should display transaction list filters', async () => {
    await act(async () => {
      renderTransactionFilters();
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText('ui-finance.transaction.type')).toBeDefined();
    expect(screen.getByText('ui-finance.transaction.source')).toBeDefined();
    expect(screen.getByText('ui-finance.transaction.expenseClass')).toBeDefined();
  });
});

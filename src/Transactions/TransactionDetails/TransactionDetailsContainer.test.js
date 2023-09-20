import React from 'react';
import { act, render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import TransactionDetailsContainer from './TransactionDetailsContainer';

jest.mock('./TransactionDetails', () => {
  return jest.fn(() => 'TransactionDetails');
});

const defaultProps = {
  history: {},
  location: {},
  match: { params: { id: 'transactionId' } },
  mutator: {
    transactionFunds: {
      GET: jest.fn(),
    },
    transactionDetails: {
      GET: jest.fn(),
    },
    fiscalYear: {
      GET: jest.fn(),
    },
  },
  fundId: 'fundId',
  baseUrl: '/baseUrl',
};

const renderTransactionDetailsContainer = (props = defaultProps) => (render(
  <TransactionDetailsContainer
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('TransactionDetailsContainer', () => {
  it('should load transaction data', async () => {
    defaultProps.mutator.transactionFunds.GET.mockReturnValue(Promise.resolve([]));
    defaultProps.mutator.transactionDetails.GET.mockReturnValue(Promise.resolve({}));
    defaultProps.mutator.fiscalYear.GET.mockReturnValue(Promise.resolve({}));

    await act(async () => {
      renderTransactionDetailsContainer();
    });

    expect(defaultProps.mutator.transactionFunds.GET).toHaveBeenCalled();
    expect(defaultProps.mutator.transactionDetails.GET).toHaveBeenCalled();
    expect(defaultProps.mutator.fiscalYear.GET).toHaveBeenCalled();
  });
});

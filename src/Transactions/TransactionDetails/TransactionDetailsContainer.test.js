import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import {
  ORDER_STATUSES,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

import { ENCUMBRANCE_STATUS } from '../../common/const';
import TransactionDetailsContainer from './TransactionDetailsContainer';

jest.mock('./TransactionInformation', () => {
  return jest.fn(() => 'TransactionInformation');
});

const defaultProps = {
  history: {},
  location: {},
  match: { params: { id: 'transactionId' } },
  mutator: {
    transactionFunds: {
      GET: jest.fn(() => Promise.resolve([])),
    },
    transactionDetails: {
      GET: jest.fn(() => Promise.resolve({})),
    },
    fiscalYear: {
      GET: jest.fn(() => Promise.resolve({ code: 'FY2069' })),
    },
  },
  fundId: 'fundId',
  baseUrl: '/baseUrl',
};

const kyMock = {
  post: jest.fn(() => ({
    json: () => Promise.resolve(),
  })),
};

const renderTransactionDetailsContainer = (props = {}) => render(
  <TransactionDetailsContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('TransactionDetailsContainer', () => {
  beforeEach(() => {
    defaultProps.mutator.fiscalYear.GET.mockClear();
    defaultProps.mutator.transactionDetails.GET.mockClear();
    defaultProps.mutator.transactionFunds.GET.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should load transaction data', async () => {
    await act(async () => {
      renderTransactionDetailsContainer();
    });

    expect(defaultProps.mutator.transactionFunds.GET).toHaveBeenCalled();
    expect(defaultProps.mutator.transactionDetails.GET).toHaveBeenCalled();
    expect(defaultProps.mutator.fiscalYear.GET).toHaveBeenCalled();
  });

  it('should handle encumbrance unrelease', async () => {
    defaultProps.mutator.transactionDetails.GET.mockResolvedValue({
      id: 'transactionId',
      transactionType: TRANSACTION_TYPES.encumbrance,
      encumbrance: {
        status: ENCUMBRANCE_STATUS.released,
        orderStatus: ORDER_STATUSES.open,
      },
    });

    await act(async () => renderTransactionDetailsContainer());
    await userEvent.click(screen.getByText('ui-finance.transaction.unreleaseEncumbrance.button'));
    await userEvent.click(screen.getByText('ui-finance.transaction.button.confirm'));

    expect(kyMock.post).toHaveBeenCalled();
  });
});

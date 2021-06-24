import React from 'react';
import { render } from '@testing-library/react';

import { TRANSACTION_TYPES } from '@folio/stripes-acq-components';

import TransactionDetails from './TransactionDetails';

jest.mock('./TransactionInformation', () => {
  return jest.fn(() => 'TransactionInformation');
});

const defaultProps = {
  fiscalYearCode: 'fiscalYearCode',
  fundId: 'fundId',
  transaction: { transactionType: TRANSACTION_TYPES.allocation },
  onClose: jest.fn(),
  releaseTransaction: jest.fn(),
};

const renderTransactionDetails = (props = defaultProps) => (render(
  <TransactionDetails
    {...props}
  />,
));

describe('TransactionDetails component', () => {
  it('should display transaction details', () => {
    const { getByText } = renderTransactionDetails();

    expect(getByText('ui-finance.transaction.information')).toBeDefined();
  });

  it('should not display release encumbrance button', () => {
    const { queryByText } = renderTransactionDetails();

    expect(queryByText('ui-finance.transaction.releaseEncumbrance.button')).toBeNull();
  });

  it('should display release encumbrance button', () => {
    const { getByText } = renderTransactionDetails({
      ...defaultProps,
      transaction: { transactionType: TRANSACTION_TYPES.encumbrance },
    });

    expect(getByText('ui-finance.transaction.releaseEncumbrance.button')).toBeDefined();
  });
});

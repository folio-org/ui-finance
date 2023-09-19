import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import TransactionInformation from './TransactionInformation';

jest.mock('./SourceValue', () => {
  return jest.fn(() => 'SourceValue');
});

const defaultProps = {
  fiscalYearCode: 'FY-2021',
  fromFundName: 'fromFund',
  toFundName: 'toFund',
  fundId: 'fundId',
  transaction: {},
};

const renderTransactionInformation = (props = defaultProps) => (render(
  <TransactionInformation
    {...props}
  />,
));

describe('TransactionInformation component', () => {
  it('should display transaction information', () => {
    const { getByText } = renderTransactionInformation();

    expect(getByText(defaultProps.fiscalYearCode)).toBeDefined();
    expect(getByText(defaultProps.fromFundName)).toBeDefined();
    expect(getByText(defaultProps.toFundName)).toBeDefined();
  });

  it('should not display encumbrance information', () => {
    const { queryByText } = renderTransactionInformation();

    expect(queryByText('ui-finance.transaction.status')).toBeNull();
  });

  it('should display encumbrance information', () => {
    const transaction = { encumbrance: { status: 'Pending' } };
    const { queryByText } = renderTransactionInformation({ ...defaultProps, transaction });

    expect(queryByText('ui-finance.transaction.status')).toBeDefined();
    expect(queryByText(`ui-finance.transaction.status.${transaction.encumbrance.status}`)).toBeDefined();
  });
});

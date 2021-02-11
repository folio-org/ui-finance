import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { TRANSACTION_SOURCE } from '../../../constants';
import {
  useSourceValue,
} from './useSourceValue';
import SourceValue from './SourceValue';

jest.mock('./useSourceValue', () => ({ useSourceValue: jest.fn() }));

const invoiceTransaction = {
  source: TRANSACTION_SOURCE.invoice,
  sourceInvoiceId: 'sourceInvoiceId',
};
const userTransaction = {
  source: TRANSACTION_SOURCE.user,
};

const renderSourceValue = (transaction) => render(
  <MemoryRouter>
    <SourceValue transaction={transaction} />
  </MemoryRouter>,
);

describe('SourceValue', () => {
  describe('Invoice source', () => {
    beforeEach(() => {
      useSourceValue.mockClear().mockReturnValue({
        isLoading: false,
        data: '1001-1',
      });
    });

    it('should render invoice number with hyperlink', () => {
      const { getByText, getByTestId } = renderSourceValue(invoiceTransaction);

      expect(getByText('1001-1')).toBeDefined();
      expect(getByTestId('transaction-source-link')).toBeDefined();
    });
  });

  describe('User source', () => {
    beforeEach(() => {
      useSourceValue.mockClear().mockReturnValue({
        isLoading: false,
        data: 'User',
      });
    });

    it('should render User source without hyperlink', () => {
      const { getByText, queryByTestId } = renderSourceValue(userTransaction);

      expect(getByText('ui-finance.transaction.source.User')).toBeDefined();
      expect(queryByTestId('transaction-source-link')).toBeNull();
    });
  });
});

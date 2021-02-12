import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { TRANSACTION_SOURCE } from '../../../constants';
import {
  useSource,
} from './useSource';
import SourceValue from './SourceValue';

jest.mock('./useSource', () => ({ useSource: jest.fn() }));

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
      useSource.mockClear().mockReturnValue({
        isLoading: false,
        sourceValue: '1001-1',
        sourceLink: 'invoiceLink',
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
      useSource.mockClear().mockReturnValue({
        isLoading: false,
        sourceValue: 'User',
      });
    });

    it('should render User source without hyperlink', () => {
      const { getByText, queryByTestId } = renderSourceValue(userTransaction);

      expect(getByText('User')).toBeDefined();
      expect(queryByTestId('transaction-source-link')).toBeNull();
    });
  });
});

import React from 'react';
import { render } from '@testing-library/react';

import { TRANSACTION_SOURCE } from '../../../constants';
import {
  useSourceLink,
} from './useSourceLink';
import SourceValue from './SourceValue';

jest.mock('./useSourceLink', () => ({ useSourceLink: jest.fn() }));

const invoiceTransaction = {
  source: TRANSACTION_SOURCE.invoice,
  sourceInvoiceId: 'sourceInvoiceId',
};
const userTransaction = {
  source: TRANSACTION_SOURCE.user,
};

const renderSourceValue = (transaction) => render(
  <SourceValue transaction={transaction} />,
);

describe('SourceValue', () => {
  describe('Invoice source', () => {
    beforeEach(() => {
      useSourceLink.mockClear().mockReturnValue('1001-1');
    });

    it('should render invoice number', () => {
      const { getByText } = renderSourceValue(invoiceTransaction);

      expect(getByText('1001-1')).toBeDefined();
    });
  });

  describe('User source', () => {
    beforeEach(() => {
      useSourceLink.mockClear().mockReturnValue(null);
    });

    it('should render User source', () => {
      const { getByText } = renderSourceValue(userTransaction);

      expect(getByText('ui-finance.transaction.source.User')).toBeDefined();
    });
  });
});

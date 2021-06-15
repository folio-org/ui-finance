import React from 'react';
import { FormattedMessage } from 'react-intl';
import { validateTransactionForm } from './fundValidation';

const fundId = 'fundId';

test('Validate transaction form if fromFundId and toFundId are not specified', () => {
  const validation = validateTransactionForm({ fundId });

  expect(validation.fromFundId).toStrictEqual(<FormattedMessage id="stripes-acq-components.validation.required" />);
  expect(validation.toFundId).toStrictEqual(<FormattedMessage id="stripes-acq-components.validation.required" />);
});

test('Validate transaction form if fromFundId is equal toFundId', () => {
  const validation = validateTransactionForm({ fundId, fromFundId: fundId, toFundId: fundId });

  expect(validation.toFundId).toStrictEqual(<FormattedMessage id="ui-finance.transaction.fundValidation" />);
});

test('Validate transaction form if fromFundId not equal fundId and toFundId is not equal fundId', () => {
  const validation = validateTransactionForm({ fundId, fromFundId: 'fromFundId', toFundId: 'toFundId' });

  expect(validation.toFundId).toStrictEqual(<FormattedMessage id="ui-finance.transaction.fundValidation2" />);
  expect(validation.fromFundId).toStrictEqual(<FormattedMessage id="ui-finance.transaction.fundValidation2" />);
});

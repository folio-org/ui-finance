import React from 'react';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import FundDetails from './FundDetails';

const MESSAGES = {
  'ui-finance.fund.information.name': 'name',
  'ui-finance.fund.information.code': 'code',
  'ui-finance.fund.information.ledger': 'ledger',
  'ui-finance.fund.information.status': 'status',
  'ui-finance.fund.information.currency': 'currency',
  'ui-finance.fund.information.type': 'type',
  'ui-finance.fund.information.transferFrom': 'transferFrom',
  'ui-finance.fund.information.transferTo': 'transferTo',
  'ui-finance.fund.information.externalAccount': 'externalAccount',
  'ui-finance.fund.information.description': 'description',
  'stripes-acq-components.label.acqUnits': 'acqUnits',
  'stripes-components.noValue.noValueSet': 'noValueSet',
};

const DEFAULT_COMPOSITE_FUND = {
  fund: {
    id: '6a1ee818-e502-4eaa-a430-94abe3d18d58',
    allocatedFromIds: [],
    allocatedToIds: [],
    code: 'test',
    externalAccountNo: 'ftests',
    fundStatus: 'Active',
    ledgerId: 'af6735ef-a4a3-4e9a-a709-b5022d1a750f',
    name: 'Test',
    acqUnitIds: [],
  },
  groupIds: ['0a8dd71c-f1cd-4486-bbdc-dd0fa5035e3a'],
};

const renderComponent = (compositeFund = DEFAULT_COMPOSITE_FUND) => (render(
  <IntlProvider locale="en" messages={MESSAGES}>
    <FundDetails
      acqUnitIds={compositeFund.fund.acqUnitIds}
      fund={compositeFund.fund}
      groupIds={compositeFund.groupIds}
    />
  </IntlProvider>,
));

describe('FundDetails component', () => {
  it('should display NoValue', async () => {
    await act(async () => {
      renderComponent();
    });

    const description = screen.getByTestId('description').querySelector('[data-test-kv-value]');
    const currency = screen.getByTestId('currency').querySelector('[data-test-kv-value]');

    expect(description).toHaveTextContent('-');
    expect(currency).toHaveTextContent('-');
  });
});

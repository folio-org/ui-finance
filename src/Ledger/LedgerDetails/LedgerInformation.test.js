import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import LedgerInformation from './LedgerInformation';

const MESSAGES = {
  'ui-finance.ledger.name': 'name',
  'ui-finance.ledger.code': 'code',
  'ui-finance.ledger.currentFiscalYear': 'currentFiscalYear',
  'ui-finance.ledger.status': 'status',
  'ui-finance.ledger.status.active': 'active',
  'ui-finance.budget.netTransfers': 'netTransfers',
  'ui-finance.ledger.allocated': 'allocated',
  'ui-finance.ledger.unavailable': 'unavailable',
  'ui-finance.ledger.available': 'available',
  'ui-finance.ledger.description': 'description',
  'stripes-acq-components.label.acqUnits': 'acqUnits',
  'stripes-components.noValue.noValueSet': 'noValueSet',
};

const DEFAULT_FY = {
  id: 'd83adc1c-8e52-4e67-b798-9c16f5908960',
  acqUnitIds: [],
  name: 'Test fiscal year 2019',
  code: 'TY2019',
  currency: 'USD',
  periodStart: '2019-01-02T00:00:00.000+0000',
  periodEnd: '2019-09-18T00:00:00.000+0000',
  series: 'TY',
  metadata: {
    createdDate: '2020-09-10T09:14:23.121+0000',
    createdByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
    updatedDate: '2020-09-10T09:14:23.121+0000',
    updatedByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
  },
};

const DEFAULT_LEDGER = {
  acqUnitIds: [],
  code: 'test',
  fiscalYearOneId: 'd83adc1c-8e52-4e67-b798-9c16f5908960',
  id: 'af6735ef-a4a3-4e9a-a709-b5022d1a750f',
  ledgerStatus: 'Active',
  metadata: {
    createdDate: '2020-09-10T10:16:25.938+0000',
    createdByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
    updatedByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
    updatedDate: '2020-09-10T10:16:25.938+0000',
  },
  createdByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
  createdDate: '2020-09-10T10:16:25.938+0000',
  updatedByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
  updatedDate: '2020-09-10T10:16:25.938+0000',
  name: 'test',
  netTransfers: 0,
  restrictEncumbrance: true,
  restrictExpenditures: true,
};

const renderComponent = (fiscalYear = DEFAULT_FY, ledger = DEFAULT_LEDGER) => (render(
  <IntlProvider locale="en" messages={MESSAGES}>
    <LedgerInformation
      metadata={ledger.metadata}
      name={ledger.name}
      code={ledger.code}
      status={ledger.ledgerStatus}
      description={ledger.description}
      acqUnitIds={ledger.acqUnitIds}
      fiscalYearCode={fiscalYear.code}
      available={ledger.available}
      allocated={ledger.allocated}
      unavailable={ledger.unavailable}
      currency={fiscalYear.currency}
      netTransfers={ledger.netTransfers}
    />
  </IntlProvider>,
));

describe('LedgerInformation component', () => {
  it('should display NoValue', () => {
    renderComponent();
    const description = screen.getByTestId('description').querySelector('[data-test-kv-value]');

    expect(description).toHaveTextContent('-');
  });
});

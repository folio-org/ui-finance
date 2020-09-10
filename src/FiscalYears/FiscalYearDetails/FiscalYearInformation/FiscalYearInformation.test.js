import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import FiscalYearInformation from './FiscalYearInformation';

const MESSAGES = {
  'ui-finance.fiscalYear.information.name': 'name',
  'ui-finance.fiscalYear.information.code': 'code',
  'ui-finance.fiscalYear.information.periodStart': 'periodStart',
  'ui-finance.fiscalYear.information.periodEnd': 'periodEnd',
  'ui-finance.fiscalYear.information.allocated': 'allocated',
  'ui-finance.fiscalYear.information.unavailable': 'unavailable',
  'ui-finance.fiscalYear.information.available': 'available',
  'ui-finance.fiscalYear.information.description': 'description',
  'stripes-acq-components.label.acqUnits': 'stripes-acq-components.label.acqUnits',
  'stripes-components.selection.filterOptionsLabel': 'Label',
  'stripes-components.selection.emptyList': 'The list is empty',
  'stripes-components.selection.noMatches': 'No any matches',
  'stripes-components.tableEmpty': 'stripes-components.tableEmpty',
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

const renderComponent = (fiscalYear = DEFAULT_FY, fiscalYearTotals = {}) => (render(
  <IntlProvider locale="en" messages={MESSAGES}>
    <FiscalYearInformation
      acqUnitIds={fiscalYear.acqUnitIds}
      code={fiscalYear.code}
      description={fiscalYear.description}
      metadata={fiscalYear.metadata}
      name={fiscalYear.name}
      periodEnd={fiscalYear.periodEnd}
      periodStart={fiscalYear.periodStart}
      currency={fiscalYear.currency}
      allocated={fiscalYearTotals.allocated}
      available={fiscalYearTotals.available}
      unavailable={fiscalYearTotals.unavailable}
    />
  </IntlProvider>,
));

describe('FiscalYearInformation component', () => {
  it('should display NoValue', () => {
    renderComponent();
    const description = screen.getByTestId('description').querySelector('[data-test-kv-value]');

    expect(description).toHaveTextContent('-');
  });
});

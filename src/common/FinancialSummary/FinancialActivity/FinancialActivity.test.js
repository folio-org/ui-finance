import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import FinancialActivity from './FinancialActivity';

const TEST_DATA = {
  encumbered: 10,
  awaitingPayment: 100,
  unavailable: 20,
};

const renderFinancialActivity = (data = TEST_DATA, currency = 'USD') => (render(
  <IntlProvider locale="en">
    <FinancialActivity
      data={data}
      currency={currency}
    />
  </IntlProvider>,
));

describe('FinancialActivity component', () => {
  it('should display amounts', () => {
    const { getByText } = renderFinancialActivity();

    expect(getByText('$10.00')).toBeDefined();
    expect(getByText('$100.00')).toBeDefined();
    expect(getByText('$20.00')).toBeDefined();
  });
});

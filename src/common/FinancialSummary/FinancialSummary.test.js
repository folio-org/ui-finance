import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import FinancialSummary from './FinancialSummary';

const renderFinancialSummary = (data = {}, fiscalYearCurrency = 'USD') => (render(
  <IntlProvider locale="en">
    <FinancialSummary
      data={data}
      fiscalYearCurrency={fiscalYearCurrency}
    />
  </IntlProvider>,
));

describe('FinancialSummary component', () => {
  it('should display headers', () => {
    const { getByText } = renderFinancialSummary();

    expect(getByText('ui-finance.financialSummary.financialActivity')).toBeDefined();
    expect(getByText('ui-finance.financialSummary.fundingInformation')).toBeDefined();
  });

  it('should display balances', () => {
    const { getByText } = renderFinancialSummary();

    expect(getByText('ui-finance.financialSummary.availableBalance')).toBeDefined();
    expect(getByText('ui-finance.financialSummary.cashBalance')).toBeDefined();
  });
});

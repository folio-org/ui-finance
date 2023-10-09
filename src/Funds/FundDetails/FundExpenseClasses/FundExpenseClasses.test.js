import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import FundExpenseClasses from './FundExpenseClasses';

const defaultProps = {
  budgetId: 'budgetId',
  currency: 'USD',
  resources: { totals: { failed: false, isPending: false, records: [{}] } },
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    <IntlProvider>
      {children}
    </IntlProvider>
  </MemoryRouter>
);

const renderFundExpenseClasses = (props = defaultProps) => render(
  <FundExpenseClasses
    {...props}
  />,
  { wrapper },
);

describe('FundExpenseClasses component', () => {
  it('should display label', () => {
    const { getByText } = renderFundExpenseClasses();

    expect(getByText('ui-finance.fund.currentExpenseClasses')).toBeDefined();
  });
});

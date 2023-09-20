import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import BudgetInformation from './BudgetInformation';

const defaultProps = {
  allowableEncumbrance: 100,
  allowableExpenditure: 50,
  budgetStatus: 'Active',
  fiscalEnd: '2021-12-31T00:00:00.000+00:00',
  fiscalStart: '2021-01-01T00:00:00.000+00:00',
  name: 'testBudget',
  id: 'testId',
};

const renderBudgetInformation = (props = defaultProps) => (render(
  <BudgetInformation {...props} />,
  { wrapper: MemoryRouter },
));

describe('BudgetInformation component', () => {
  it('should display budget information', () => {
    const { getByText } = renderBudgetInformation();

    expect(getByText(`${defaultProps.allowableEncumbrance}%`)).toBeDefined();
    expect(getByText(`${defaultProps.allowableExpenditure}%`)).toBeDefined();
    expect(getByText('2021-01-01')).toBeDefined();
    expect(getByText('2021-12-31')).toBeDefined();
    expect(getByText(defaultProps.budgetStatus)).toBeDefined();
    expect(getByText(defaultProps.name)).toBeDefined();
  });
});

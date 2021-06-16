import React from 'react';
import { render } from '@testing-library/react';

import FiscalYearsListFilter from './FiscalYearsListFilter';

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderFiscalYearsListFilter = (props = defaultProps) => (render(
  <FiscalYearsListFilter
    {...props}
  />,
));

describe('FiscalYearsListFilter component', () => {
  it('should display fiscal year list filters', () => {
    const { getByText } = renderFiscalYearsListFilter();

    expect(getByText('ui-finance.fiscalYear.filters.acqUnits')).toBeDefined();
  });
});

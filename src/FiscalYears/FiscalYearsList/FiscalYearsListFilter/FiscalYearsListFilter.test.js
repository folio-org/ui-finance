import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import FiscalYearsListFilter from './FiscalYearsListFilter';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqUnitFilter: () => <span>stripes-acq-components.filter.acqUnit</span>,
}));

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

    expect(getByText('stripes-acq-components.filter.acqUnit')).toBeDefined();
  });
});

import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import FundsListFilters from './FundsListFilters';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqUnitFilter: () => <span>stripes-acq-components.filter.acqUnit</span>,
  AcqTagsFilter: () => <span>Tag filter</span>,
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderFundsListFilters = (props = defaultProps) => (render(
  <FundsListFilters
    {...props}
  />,
));

describe('FundsListFilters component', () => {
  it('should display fund list filters', () => {
    const { getByText } = renderFundsListFilters();

    expect(getByText('ui-finance.fund.filters.ledger')).toBeDefined();
    expect(getByText('stripes-acq-components.filter.acqUnit')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.status')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.type')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.group')).toBeDefined();
  });
});

import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import LedgerListFilters from './LedgerListFilters';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqUnitFilter: () => <span>stripes-acq-components.filter.acqUnit</span>,
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderLedgerListFilters = (props = defaultProps) => (render(
  <LedgerListFilters
    {...props}
  />,
));

describe('LedgerListFilters component', () => {
  it('should display ledger list filters', () => {
    const { getByText } = renderLedgerListFilters();

    expect(getByText('ui-finance.ledger.status')).toBeDefined();
    expect(getByText('stripes-acq-components.filter.acqUnit')).toBeDefined();
  });
});

import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import GroupsListFilters from './GroupsListFilters';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqUnitFilter: () => <span>stripes-acq-components.filter.acqUnit</span>,
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderGroupsListFilters = (props = defaultProps) => (render(
  <GroupsListFilters
    {...props}
  />,
));

describe('GroupsListFilters component', () => {
  it('should display group list filters', () => {
    const { getByText } = renderGroupsListFilters();

    expect(getByText('ui-finance.groups.status')).toBeDefined();
    expect(getByText('stripes-acq-components.filter.acqUnit')).toBeDefined();
  });
});

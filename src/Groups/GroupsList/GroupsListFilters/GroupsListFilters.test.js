import React from 'react';
import { render } from '@testing-library/react';

import GroupsListFilters from './GroupsListFilters';

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

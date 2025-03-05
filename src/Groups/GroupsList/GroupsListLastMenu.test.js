import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import GroupsListLastMenu from './GroupsListLastMenu';

const renderGroupsListLastMenu = () => render(
  <GroupsListLastMenu />,
  { wrapper: MemoryRouter },
);

describe('GroupsListLastMenu', () => {
  it('should render group list last menu', () => {
    const { getByTestId } = renderGroupsListLastMenu();

    expect(getByTestId('create-group-button')).toBeDefined();
    // Temporarily hide this section for groups
    // expect(getByTestId('view-batch-allocation-logs-button')).toBeDefined();
  });
});

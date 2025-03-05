import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import GroupsListLastMenu from './GroupsListLastMenu';

const renderGroupsListLastMenu = () => render(
  <GroupsListLastMenu />,
  { wrapper: MemoryRouter },
);

describe('GroupsListLastMenu', () => {
  // TODO: Enable after group batch allocation feature is created
  xit('should render group list last menu', () => {
    const { getByTestId } = renderGroupsListLastMenu();

    expect(getByTestId('create-group-button')).toBeDefined();
    expect(getByTestId('view-batch-allocation-logs-button')).toBeDefined();
  });
});

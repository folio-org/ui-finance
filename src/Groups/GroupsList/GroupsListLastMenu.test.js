import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import GroupsListLastMenu from './GroupsListLastMenu';

const renderGroupsListLastMenu = () => render(
  <GroupsListLastMenu />,
  { wrapper: MemoryRouter },
);

describe('GroupsListLastMenu', () => {
  it('should render group list last menu', () => {
    const { getByText } = renderGroupsListLastMenu();

    expect(getByText('stripes-smart-components.new')).toBeDefined();
  });
});

import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import GroupsListContainer from './GroupsListContainer';

jest.mock('./GroupsList', () => jest.fn().mockReturnValue('GroupsList'));

const defaultProps = {
  mutator: {
    groupsListGroups: {
      GET: jest.fn(),
    },
  },
  location: {},
  history: {},
};

const renderGroupsListContainer = (props = defaultProps) => render(
  <GroupsListContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('GroupsListContainer', () => {
  beforeEach(() => {
    defaultProps.mutator.groupsListGroups.GET.mockClear();
  });

  it('should display GroupsList', async () => {
    defaultProps.mutator.groupsListGroups.GET.mockReturnValue(Promise.resolve({ groups: [], totalRecords: 0 }));

    await act(async () => renderGroupsListContainer());

    expect(screen.getByText('GroupsList')).toBeDefined();
  });
});

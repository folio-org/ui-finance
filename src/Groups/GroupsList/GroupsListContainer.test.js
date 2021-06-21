import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import queryString from 'query-string';

import { GroupsListContainer, buildGroupsQuery } from './GroupsListContainer';
import GroupsList from './GroupsList';

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

  it('should load more data', async () => {
    await act(async () => renderGroupsListContainer());

    GroupsList.mock.calls[0][0].onNeedMoreData()

    expect(defaultProps.mutator.groupsListGroups.GET).toHaveBeenCalled();
  });

  describe('search query', () => {
    it('should build query when search is active', () => {
      const expectedQuery = '(((name="group*" or code="group*" or description="group*"))) sortby name/sort.ascending';

      expect(buildGroupsQuery(queryString.parse('?query=group'))).toBe(expectedQuery);
    });

    it('should build query when search by field is active', () => {
      const expectedQuery = '(((name=group*))) sortby name/sort.ascending';

      expect(buildGroupsQuery(queryString.parse('?qindex=name&query=group'))).toBe(expectedQuery);
    });
  });
});

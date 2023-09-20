import React from 'react';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router';

import GroupsListContainer from './GroupsListContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePagination: () => ({}),
}));
jest.mock('./GroupsList', () => jest.fn().mockReturnValue('GroupsList'));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useGroups: jest.fn().mockReturnValue({}),
}));

const renderGroupsListContainer = () => render(
  <GroupsListContainer />,
  { wrapper: MemoryRouter },
);

describe('GroupsListContainer', () => {
  it('should display GroupsList', async () => {
    await act(async () => renderGroupsListContainer());

    expect(screen.getByText('GroupsList')).toBeDefined();
  });
});

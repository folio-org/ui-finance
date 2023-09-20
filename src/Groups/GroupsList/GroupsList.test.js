import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import GroupsList from './GroupsList';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
    ResetButton: () => <span>ResetButton</span>,
    SingleSearchForm: () => <span>SingleSearchForm</span>,
    useItemToView: jest.fn().mockReturnValue({}),
  };
});

jest.mock('../GroupDetails', () => ({
  GroupDetailsContainer: jest.fn().mockReturnValue('GroupDetailsContainer'),
}));
jest.mock('./GroupsListFilters', () => jest.fn().mockReturnValue('GroupsListFilters'));

const defaultProps = {
  onNeedMoreData: jest.fn(),
  resetData: jest.fn(),
  refreshList: jest.fn(),
  groupsCount: 1,
  groups: [{}],
  isLoading: false,
};

const renderGroupsList = (props = defaultProps) => (render(
  <GroupsList {...props} />,
  { wrapper: MemoryRouter },
));

describe('GroupsList', () => {
  it('should display search control', () => {
    const { getByText } = renderGroupsList();

    expect(getByText('SingleSearchForm')).toBeDefined();
  });

  it('should display reset filters control', () => {
    const { getByText } = renderGroupsList();

    expect(getByText('ResetButton')).toBeDefined();
  });

  it('should display group list filters', () => {
    const { getByText } = renderGroupsList();

    expect(getByText('GroupsListFilters')).toBeDefined();
  });
});

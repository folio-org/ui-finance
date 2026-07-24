import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import GroupsList from './GroupsList';
import { useBrowseTabEnabled } from '../../common/hooks';

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
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useBrowseTabEnabled: jest.fn(),
}));
jest.mock('../../Browse', () => ({
  ...jest.requireActual('../../Browse/constants'),
  SearchBrowseSegmentedControl: jest.fn(({ onTabChange }) => (
    <button type="button" onClick={() => onTabChange('browse')}>SearchBrowseSegmentedControl</button>
  )),
}));

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
  beforeEach(() => {
    useBrowseTabEnabled.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not display the search/browse control when browse tab is disabled', () => {
    renderGroupsList();

    expect(screen.queryByText('SearchBrowseSegmentedControl')).not.toBeInTheDocument();
  });

  it('should display the search/browse control and navigate to browse route when browse tab is enabled', async () => {
    useBrowseTabEnabled.mockReturnValue(true);

    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <GroupsList {...defaultProps} />
      </Router>,
    );

    expect(screen.getByText('SearchBrowseSegmentedControl')).toBeInTheDocument();

    await userEvent.click(screen.getByText('SearchBrowseSegmentedControl'));

    expect(history.location.pathname).toBe('/finance/browse');
  });

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

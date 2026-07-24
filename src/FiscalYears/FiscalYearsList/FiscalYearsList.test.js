import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import FiscalYearsList from './FiscalYearsList';
import { useBrowseTabEnabled } from '../../common/hooks';

jest.mock('react-virtualized-auto-sizer', () => jest.fn(
  (props) => <div>{props.children({ width: 123 })}</div>,
));
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

jest.mock('../FiscalYearDetails', () => ({
  FiscalYearDetailsContainer: jest.fn().mockReturnValue('FiscalYearDetailsContainer'),
}));
jest.mock('./FiscalYearsListFilter', () => jest.fn().mockReturnValue('FiscalYearsListFilter'));
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
  fiscalYearsCount: 1,
  fiscalYears: [{ id: 'fyId', code: 'FY2022', name: 'FY 2022' }],
  isLoading: false,
  pagination: {},
};
const renderFiscalYearsList = (props = defaultProps) => (render(
  <FiscalYearsList {...props} />,
  { wrapper: MemoryRouter },
));

describe('FiscalYearsList', () => {
  beforeEach(() => {
    useBrowseTabEnabled.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not display the search/browse control when browse tab is disabled', () => {
    renderFiscalYearsList();

    expect(screen.queryByText('SearchBrowseSegmentedControl')).not.toBeInTheDocument();
  });

  it('should display the search/browse control and navigate to browse route when browse tab is enabled', async () => {
    useBrowseTabEnabled.mockReturnValue(true);

    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <FiscalYearsList {...defaultProps} />
      </Router>,
    );

    expect(screen.getByText('SearchBrowseSegmentedControl')).toBeInTheDocument();

    await user.click(screen.getByText('SearchBrowseSegmentedControl'));

    expect(history.location.pathname).toBe('/finance/browse');
  });

  it('should display search control', () => {
    const { getByText } = renderFiscalYearsList();

    expect(getByText('SingleSearchForm')).toBeDefined();
  });

  it('should display reset filters control', () => {
    const { getByText } = renderFiscalYearsList();

    expect(getByText('ResetButton')).toBeDefined();
  });

  it('should display fiscal year list filters', () => {
    const { getByText } = renderFiscalYearsList();

    expect(getByText('FiscalYearsListFilter')).toBeDefined();
  });

  it('should render fiscal year results list', async () => {
    renderFiscalYearsList();

    await act(async () => user.click(screen.getByText(defaultProps.fiscalYears[0].name)));

    expect(screen.getByText('ui-finance.fiscalYear.list.name')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.fiscalYear.list.code')).toBeInTheDocument();
  });
});

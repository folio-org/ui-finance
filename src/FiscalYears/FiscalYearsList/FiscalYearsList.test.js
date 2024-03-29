import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FiscalYearsList from './FiscalYearsList';

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

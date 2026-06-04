import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { AcqCheckboxFilter, FiscalYearFilter } from '@folio/stripes-acq-components';

import BrowseFilters from './BrowseFilters';
import { BROWSE_FILTERS } from '../constants';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqCheckboxFilter: jest.fn(() => <div data-testid="acq-checkbox-filter" />),
  FiscalYearFilter: jest.fn(() => <div data-testid="fiscal-year-filter" />),
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <BrowseFilters
    {...defaultProps}
    {...props}
  />,
);

describe('BrowseFilters', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the FiscalYearFilter', () => {
    renderComponent();

    expect(FiscalYearFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BROWSE_FILTERS.FISCAL_YEAR,
        name: BROWSE_FILTERS.FISCAL_YEAR,
        labelId: 'ui-finance.browse.filter.fiscalYear',
        closedByDefault: false,
      }),
      expect.anything(),
    );
  });

  it('should render all five AcqCheckboxFilters', () => {
    renderComponent();

    const filterNames = [
      BROWSE_FILTERS.LEDGER_STATUS,
      BROWSE_FILTERS.GROUP_STATUS,
      BROWSE_FILTERS.FUND_STATUS,
      BROWSE_FILTERS.BUDGET_STATUS,
      BROWSE_FILTERS.EXPENSE_CLASS_STATUS,
    ];

    filterNames.forEach(name => {
      expect(AcqCheckboxFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          id: name,
          name,
          closedByDefault: true,
        }),
        expect.anything(),
      );
    });
  });

  it('should pass activeFilters to each filter', () => {
    const activeFilters = {
      [BROWSE_FILTERS.FISCAL_YEAR]: ['fy-1'],
      [BROWSE_FILTERS.LEDGER_STATUS]: ['Active'],
    };

    renderComponent({ activeFilters });

    expect(FiscalYearFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        activeFilters: ['fy-1'],
      }),
      expect.anything(),
    );

    expect(AcqCheckboxFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BROWSE_FILTERS.LEDGER_STATUS,
        activeFilters: ['Active'],
      }),
      expect.anything(),
    );
  });

  it('should adapt applyFilters callback to { name, values } format', () => {
    const applyFilters = jest.fn();

    renderComponent({ applyFilters });

    // Get the onChange callback passed to FiscalYearFilter
    const fiscalYearOnChange = FiscalYearFilter.mock.calls[0][0].onChange;

    fiscalYearOnChange({ name: BROWSE_FILTERS.FISCAL_YEAR, values: ['fy-1'] });

    expect(applyFilters).toHaveBeenCalledWith(BROWSE_FILTERS.FISCAL_YEAR, ['fy-1']);
  });
});

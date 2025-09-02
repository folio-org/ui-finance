import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  useLedgerCurrentFiscalYear,
  useLedgerPreviousFiscalYears,
} from '../../../common/hooks';
import { LedgerDetailsFiscalYear } from './LedgerDetailsFiscalYear';

jest.mock('../../../common/hooks', () => ({
  useLedgerCurrentFiscalYear: jest.fn(),
  useLedgerPreviousFiscalYears: jest.fn(),
}));

const currentFiscalYear = { id: '2022', code: 'FY2022' };
const fiscalYearOne = { id: '2021', code: 'FY2021' };

const defaultProps = {
  fiscalYearOneId: fiscalYearOne.id,
  ledgerId: 'ledger-id',
  onSelectFiscalYear: jest.fn(),
  selectedFiscalYear: currentFiscalYear.id,
};

const renderLedgerDetailsFiscalYear = (props = {}) => render(
  <LedgerDetailsFiscalYear
    {...defaultProps}
    {...props}
  />
);

describe('LedgerDetailsFiscalYear', () => {
  beforeEach(() => {
    useLedgerCurrentFiscalYear.mockReturnValue({
      currentFiscalYear,
      isLoading: false,
    });
    useLedgerPreviousFiscalYears.mockReturnValue({
      fiscalYears: [fiscalYearOne],
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render current fiscal year', () => {
    renderLedgerDetailsFiscalYear();

    expect(screen.getByRole('group', { name: 'ui-finance.groups.item.information.fiscalYear.current' })).toBeInTheDocument();
    expect(screen.getByText('FY2022')).toBeInTheDocument();
  });

  it('should render previous fiscal years', () => {
    renderLedgerDetailsFiscalYear();

    expect(screen.getByRole('group', { name: 'ui-finance.groups.item.information.fiscalYear.previous' })).toBeInTheDocument();
    expect(screen.getByText('FY2021')).toBeInTheDocument();
  });

  it('should call onSelectFiscalYear when a previous fiscal year is selected', async () => {
    renderLedgerDetailsFiscalYear();

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'ui-finance.fiscalyear' }), fiscalYearOne.id);

    expect(defaultProps.onSelectFiscalYear).toHaveBeenCalledWith(fiscalYearOne.id);
  });
});

import { useHistory } from 'react-router';
import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { FISCAL_YEAR_ROUTE } from '../../common/const';
import FiscalYearDetails from './FiscalYearDetails';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAcqRestrictions: jest.fn().mockReturnValue({ restrictions: {} }),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('../../common/FinancialSummary', () => jest.fn().mockReturnValue('FinancialSummary'));
jest.mock('../../common/RelatedFunds/useRelatedBudgets', () => ({
  useRelatedBudgets: jest.fn(() => ({ budgets: [], isFetching: false })),
}));
jest.mock('./FiscalYearInformation', () => jest.fn().mockReturnValue('FiscalYearInformation'));

const defaultProps = {
  fiscalYear: {},
  funds: [],
  groupSummaries: [],
  ledgers: [],
  onClose: jest.fn(),
  onEdit: jest.fn(),
  onRemove: jest.fn(),
  openLedger: jest.fn(),
};

const renderFiscalYearDetails = (props = defaultProps) => (render(
  <MemoryRouter>
    <FiscalYearDetails
      {...props}
    />
  </MemoryRouter>,
));

describe('FiscalYearDetails component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display fy details accordions', async () => {
    await act(async () => renderFiscalYearDetails());

    expect(screen.getByText('ui-finance.fiscalYear.details.information')).toBeDefined();
    expect(screen.getByText('ui-finance.fiscalYear.details.ledger')).toBeDefined();
    expect(screen.getByText('ui-finance.fiscalYear.details.financialSummary')).toBeDefined();
    expect(screen.getByText('ui-finance.fiscalYear.details.group')).toBeDefined();
    expect(screen.getByText('ui-finance.fiscalYear.details.fund')).toBeDefined();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      await act(async () => renderFiscalYearDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', async () => {
      await act(async () => renderFiscalYearDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should navigate to edit view when edit shortcut is called', async () => {
      await act(async () => renderFiscalYearDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(defaultProps.onEdit).toHaveBeenCalled();
    });

    it('should navigate to new form when new shortcut is called', async () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      await act(async () => renderFiscalYearDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler();

      expect(pushMock).toHaveBeenCalledWith(`${FISCAL_YEAR_ROUTE}/create`);
    });
  });
});

import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { LEDGERS_ROUTE } from '../../common/const';
import LedgerDetails from './LedgerDetails';

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
jest.mock('./LedgerInformation', () => jest.fn().mockReturnValue('LedgerInformation'));
jest.mock('./../../common/FinancialSummary', () => jest.fn().mockReturnValue('FinancialSummary'));
jest.mock('../../common/RelatedFunds/useRelatedBudgets', () => ({
  useRelatedBudgets: jest.fn(() => ({ budgets: [], isFetching: false })),
}));
jest.mock('./useRelatedGroups', () => ({
  useRelatedGroups: jest.fn(() => ({ groups: [], isFetching: false })),
}));

const defaultProps = {
  ledger: { id: 'ledgerId' },
  fiscalYear: {},
  onClose: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onRollover: jest.fn(),
  funds: [],
  rolloverErrors: [],
  rolloverToFY: {},
};

const renderLedgerDetails = (props = defaultProps) => (render(
  <MemoryRouter>
    <LedgerDetails
      {...props}
    />
  </MemoryRouter>,
));

describe('LedgerDetails component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display ledger details accordions', () => {
    const { getByText } = renderLedgerDetails();

    expect(getByText('ui-finance.ledger.information')).toBeDefined();
    expect(getByText('ui-finance.ledger.financialSummary')).toBeDefined();
    expect(getByText('ui-finance.ledger.fund')).toBeDefined();
    expect(getByText('ui-finance.ledger.group')).toBeDefined();
  });

  it('should not display rollover errors accordion', () => {
    const { queryByText } = renderLedgerDetails();

    expect(queryByText('ui-finance.ledger.rolloverErrors')).toBeNull();
  });

  it('should not display rollover errors accordion', () => {
    const { queryByText } = renderLedgerDetails({ ...defaultProps, rolloverErrors: [{}] });

    expect(queryByText('ui-finance.ledger.rolloverErrors')).toBeDefined();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', () => {
      renderLedgerDetails();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderLedgerDetails();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should navigate to edit view when edit shortcut is called', () => {
      renderLedgerDetails();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(defaultProps.onEdit).toHaveBeenCalled();
    });

    it('should navigate to new form when new shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderLedgerDetails();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler();

      expect(pushMock).toHaveBeenCalledWith(`${LEDGERS_ROUTE}/create`);
    });
  });
});

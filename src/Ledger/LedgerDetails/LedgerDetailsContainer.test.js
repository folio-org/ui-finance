import { useLocalStorage } from '@rehooks/local-storage';
import { MemoryRouter } from 'react-router';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';


import { LEDGERS_ROUTE } from '../../common/const';
import {
  useLedger,
  useLedgerCurrentFiscalYear,
  useLedgerFunds,
  useLedgerPreviousFiscalYears,
} from '../../common/hooks';
import { LedgerDetailsContainer } from './LedgerDetailsContainer';

jest.fn('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewMetaData: jest.fn(() => 'ViewMetaData'),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqUnitsView: jest.fn(() => 'AcqUnitsView'),
  fetchAllRecords: jest.fn(() => Promise.resolve([])),
  useAcqRestrictions: jest.fn(() => ({ restrictions: {} })),
}));
jest.mock('../../common/hooks', () => ({
  useLedger: jest.fn(),
  useLedgerCurrentFiscalYear: jest.fn(),
  useLedgerFunds: jest.fn(),
  useLedgerPreviousFiscalYears: jest.fn(),
}));
jest.mock('../../common/RelatedFunds/useRelatedBudgets', () => ({
  useRelatedBudgets: jest.fn(() => ({ budgets: [], isFetching: false })),
}));
jest.mock('./useRelatedGroups', () => ({
  useRelatedGroups: jest.fn(() => ({ groups: [], isFetching: false })),
}));

const ledger = {
  id: 'ledgerId',
  name: 'Ledger Name',
};

const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
};

const mutatorMock = {
  ledgerDetails: {
    DELETE: jest.fn(() => Promise.resolve()),
  },
  ledgerRollover: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
  ledgerRolloverProgress: {
    GET: jest.fn(),
  },
  ledgerRolloverErrors: {
    GET: jest.fn(),
  },
  toFiscalYear: {
    GET: jest.fn(),
  },
};

const defaultProps = {
  mutator: mutatorMock,
  match: {
    params: { id: ledger.id },
    path: 'path',
    url: 'url',
  },
  history: historyMock,
  location: {
    hash: '',
    pathname: 'pathname',
  },
  stripes: { hasPerm: jest.fn() },
};

const renderLedgerDetailsContainer = (props = {}) => render(
  <LedgerDetailsContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('LedgerDetailsContainer', () => {
  beforeEach(() => {
    useLocalStorage.mockReturnValue([true]);
    useLedgerCurrentFiscalYear.mockReturnValue({
      fiscalYear: { id: 'fiscalYearId' },
    });
    useLedgerFunds.mockReturnValue({
      funds: [{ id: 'fundId' }],
    });
    useLedger.mockReturnValue({
      ledger,
    });
    useLedgerPreviousFiscalYears.mockReturnValue({
      fiscalYears: [{ id: 'previousFiscalYearId' }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display LedgerDetails', async () => {
    renderLedgerDetailsContainer();

    expect(await screen.findAllByText(ledger.name)).toHaveLength(2);
  });

  describe('Actions', () => {
    it('should navigate to list when close action is called', async () => {
      renderLedgerDetailsContainer();

      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'stripes-components.closeItem' }));
      });

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(LEDGERS_ROUTE);
    });

    it('should navigate to form', async () => {
      renderLedgerDetailsContainer();

      await act(async () => {
        await userEvent.click(screen.getByTestId('details-edit-action'));
      })

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/edit`);
    });

    it('should navigate to rollover', async () => {
      renderLedgerDetailsContainer()

      await act(async () => {
        await userEvent.click(screen.getByTestId('action-rollover'));
      })

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/rollover`);
    });

    it('should navigate to rollover logs view', async () => {
      renderLedgerDetailsContainer();

      await act(async () => {
        await userEvent.click(screen.getByTestId('action-rollover-logs'));
      })

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/rollover-logs`);
    });

    it('should remove', async () => {
      renderLedgerDetailsContainer();

      await act(async () => {
        await userEvent.click(screen.getByTestId('details-remove-action'));
      });
      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'ui-finance.actions.remove.confirm' }));
      });

      expect(mutatorMock.ledgerDetails.DELETE).toHaveBeenCalled();
    });
  });
});

import { act, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Switch } from 'react-router-dom';

import { useOkapiKy } from '@folio/stripes/core';
import {
  collapseAllSections,
  expandAllSections,
  HasCommand,
} from '@folio/stripes/components';
import { handleKeyCommand } from '@folio/stripes-acq-components';

import { rollover } from '../../../../test/jest/fixtures/rollover';
import {
  FISCAL_YEARS_API,
  FUND_TYPES_API,
  LEDGERS_API,
  LEDGERS_ROUTE,
  LEDGER_ROLLOVER_API,
  LEDGER_ROLLOVER_SETTINGS_ROUTE,
} from '../../../common/const';
import { RolloverLedgerView } from './RolloverLedgerView';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  handleKeyCommand: jest.fn(() => jest.fn()),
}));

const fiscalYears = [
  { id: rollover.fromFiscalYearId, code: 'FY2023', periodStart: '2023-01-01T00:00:00.000+00:00', periodEnd: '2023-12-31T23:59:59.000+00:00' },
  { id: rollover.toFiscalYearId, code: 'FY2024', periodStart: '2024-01-01T00:00:00.000+00:00', periodEnd: '2024-12-31T23:59:59.000+00:00' },
];
const fundTypes = [
  { id: rollover.budgetsRollover[1].fundTypeId, name: 'Approvals' },
  { id: rollover.budgetsRollover[2].fundTypeId, name: 'Faculty' },
  { id: rollover.budgetsRollover[3].fundTypeId, name: 'Serials' },
];
const ledger = {
  id: rollover.ledgerId,
  name: 'ledgerName',
};

const kyMock = {
  get: jest.fn((url) => ({
    json: async () => {
      let result = {};

      if (url.startsWith(`${FISCAL_YEARS_API}`)) {
        result.fiscalYears = fiscalYears;
      }

      if (url.startsWith(`${FUND_TYPES_API}`)) {
        result.fundTypes = fundTypes;
      }

      if (url.startsWith(`${LEDGERS_API}/`)) {
        result = ledger;
      }

      if (url.startsWith(`${LEDGER_ROLLOVER_API}/`)) {
        result = rollover;
      }

      return Promise.resolve(result);
    },
  })),
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter
      initialEntries={[{
        pathname: `${LEDGERS_ROUTE}/${rollover.ledgerId}/rollover-settings/${rollover.id}`,
      }]}
    >
      <Switch>
        {children}
      </Switch>
    </MemoryRouter>
  </QueryClientProvider>
);

const renderRolloverLedgerView = (props = {}) => render(
  <Route
    path={LEDGER_ROLLOVER_SETTINGS_ROUTE}
    exact
    render={() => (
      <RolloverLedgerView
        {...props}
      />
    )}
  />,
  { wrapper },
);

describe('RolloverLedgerView', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should render rollover settings view', async () => {
    renderRolloverLedgerView();

    expect(await screen.findByText('ui-finance.ledger.rollover.rolloverTest')).toBeInTheDocument();
    expect(
      await screen.findByText(fiscalYears.find(({ id }) => id === rollover.fromFiscalYearId).code),
    ).toBeInTheDocument();
    expect(await screen.findByText('ui-finance.ledger.rollover.periodBeginDate')).toBeInTheDocument();
    expect(await screen.findByText('ui-finance.ledger.rollover.periodEndDate')).toBeInTheDocument();
    expect(await screen.findByText('ui-finance.budget.fiscalYear')).toBeInTheDocument();
    expect(
      await screen.findByText('ui-finance.ledger.rollover.budgets'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('ui-finance.ledger.rollover.encumbrances'),
    ).toBeInTheDocument();
  });
});

describe('RolloverLedgerView shortcuts', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    collapseAllSections.mockClear();
    expandAllSections.mockClear();
    handleKeyCommand.mockClear().mockReturnValue(onClose);
    HasCommand.mockClear();
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should close rollover view when \'cancel\' sortcut is called', async () => {
    renderRolloverLedgerView();

    await act(async () => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler());

    expect(onClose).toHaveBeenCalled();
  });

  it('should expand all accordions when \'expandAllSections\' shortcut is called', async () => {
    renderRolloverLedgerView();

    await act(async () => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler());

    expect(expandAllSections).toHaveBeenCalled();
  });

  it('should call collapse all aections when \'collapseAllSections\' shortcut is called', async () => {
    renderRolloverLedgerView();

    await act(async () => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler());

    expect(collapseAllSections).toHaveBeenCalled();
  });
});

import user from '@testing-library/user-event';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import { LEDGERS_ROUTE, LEDGER_ROLLOVER_TYPES } from '../../common/const';
import RolloverLedger from './RolloverLedger';
import { RolloverLedgerContainer } from './RolloverLedgerContainer';

const fiscalYears = [
  {
    'id': '80b3cd17-a277-411f-bf03-1bd6589fead2',
    'name': 'Fiscal year NIK2023',
    'code': 'NIK2023',
  },
  {
    'id': 'ec399906-10d8-4a37-bd4f-68a11d08f0a7',
    'name': 'Fiscal year NIK2024',
    'code': 'NIK2024',
  },
  {
    'id': '9dd778b0-827f-40a1-8bb3-bb75dbc4a6dd',
    'name': 'Fiscal year NIK2025',
    'code': 'NIK2025',
  },
];

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(() => jest.fn()),
  useNamespace: () => ['namespace'],
  useStripes: jest.fn().mockReturnValue({ hasPerm: jest.fn().mockReturnValue(true), currency: 'USD' }),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));
jest.mock('./RolloverLedger', () => jest.fn().mockReturnValue('RolloverLedger'));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useRolloverFiscalYears: jest.fn().mockReturnValue({ fiscalYears }),
  useRolloverData: jest.fn().mockReturnValue({
    budgets: [],
    currentFiscalYear: { id: 'fyId' },
    funds: [],
    fundTypesMap: {},
  }),
}));

const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};
const defaultProps = {
  mutator: {
    ledgerRollover: {
      POST: jest.fn(() => Promise.resolve()),
    },
  },
  history: historyMock,
  location: locationMock,
  match: { params: { id: 'id' }, path: 'path', url: 'url' },
  resources: {
    rolloverLedger: {
      hasLoaded: true,
      records: [{
        'id': 'id',
        'name': 'Ledger NIK 1',
        'code': 'NIK',
        'fiscalYearOneId': '80b3cd17-a277-411f-bf03-1bd6589fead2',
      }],
    },
  },
  stripes: {
    user: { user: { email: 'ex@mp.le' } },
  },
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderRolloverLedgerContainer = (props = defaultProps) => render(
  <RolloverLedgerContainer {...props} />,
  { wrapper },
);

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ totalRecords: 0 }),
  })),
};

describe('RolloverLedgerContainer', () => {
  const showCallout = jest.fn();

  beforeEach(() => {
    historyMock.push.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    RolloverLedger.mockClear();
    beforeEach(async () => {
      useShowCallout.mockClear().mockReturnValue(showCallout);
    });
  });

  it('should display RolloverLedger', () => {
    renderRolloverLedgerContainer();

    expect(screen.getByText('RolloverLedger')).toBeDefined();
  });

  it('should close', () => {
    renderRolloverLedgerContainer();

    RolloverLedger.mock.calls[0][0].onCancel();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/view`);
  });

  it('should go to create fiscal year', () => {
    renderRolloverLedgerContainer();

    RolloverLedger.mock.calls[0][0].goToCreateFY();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/rollover-create-fy`);
  });

  describe('Rollover preview', () => {
    beforeEach(async () => {
      renderRolloverLedgerContainer();

      await act(async () => RolloverLedger.mock.calls[0][0].onSubmit({
        rolloverType: LEDGER_ROLLOVER_TYPES.preview,
        encumbrancesRollover: [{
          orderType: 'Ongoing',
          basedOn: 'Expended',
          increaseBy: '1',
        }],
      }));
    });

    it('should display rollover preview confirmation modal', async () => {
      expect(screen.getByText('ui-finance.ledger.rolloverTest.confirm.message')).toBeInTheDocument();
    });

    it('should call test rollover callback', async () => {
      const confirmBtn = screen.getByText('ui-finance.ledger.rollover.confirm.btn');

      await act(async () => user.click(confirmBtn));

      expect(defaultProps.mutator.ledgerRollover.POST).toHaveBeenCalled();
      await waitFor(() => expect(showCallout).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'ui-finance.ledger.rolloverTest.start.success' })));
    });
  });

  describe('Rollover exist', () => {
    it('should prevent test rollover and show error toast message', async () => {
      const kyMockWithExistingRollovers = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({ totalRecords: 1 }),
        })),
      };

      useOkapiKy.mockClear().mockReturnValue(kyMockWithExistingRollovers);

      renderRolloverLedgerContainer();

      await act(async () => RolloverLedger.mock.calls[0][0].onSubmit({
        rolloverType: LEDGER_ROLLOVER_TYPES.preview,
        encumbrancesRollover: [{
          orderType: 'Ongoing',
          basedOn: 'Expended',
          increaseBy: '1',
        }],
        ledgerId: 'id',
        fromFiscalYearId: fiscalYears[0].id,
        toFiscalYearId: fiscalYears[1].id,
      }));

      expect(defaultProps.mutator.ledgerRollover.POST).toHaveBeenCalled();
      await waitFor(() => expect(showCallout).toHaveBeenCalledWith({
        'message': 'ui-finance.ledger.rollover.error.conflict',
        'type': 'error',
      }));
    });
  });
});

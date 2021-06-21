import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { FISCAL_YEAR_ROUTE, LEDGERS_ROUTE } from '../../common/const';
import FiscalYearDetails from './FiscalYearDetails';
import { FiscalYearDetailsContainer } from './FiscalYearDetailsContainer';

jest.mock('./FiscalYearDetails', () => jest.fn().mockReturnValue('FiscalYearDetails'));

const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
};
const mutatorMock = {
  fiscalYear: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ id: 'fyId', series: 'series' })),
    DELETE: jest.fn(),
  },
  fyGroupSummaries: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
  fyFunds: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
  fiscalYearsBySeries: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
};
const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: 'fyId' }, path: 'path' },
  history: historyMock,
  location: { hash: 'hash' },
};
const renderFiscalYearDetailsContainer = (props = defaultProps) => render(
  <FiscalYearDetailsContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('FiscalYearDetailsContainer', () => {
  beforeEach(() => {
    historyMock.push.mockClear();
  });
  it('should display FiscalYearDetails', async () => {
    renderFiscalYearDetailsContainer();

    await screen.findByText('FiscalYearDetails');

    expect(screen.getByText('FiscalYearDetails')).toBeDefined();
  });

  describe('Actions', () => {
    it('should navigate to list close action is called', () => {
      renderFiscalYearDetailsContainer();

      FiscalYearDetails.mock.calls[0][0].onClose();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(FISCAL_YEAR_ROUTE);
    });

    it('should navigate to form', () => {
      renderFiscalYearDetailsContainer();

      FiscalYearDetails.mock.calls[0][0].onEdit();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${FISCAL_YEAR_ROUTE}/${defaultProps.match.params.id}/edit`);
    });

    it('should open ledger', () => {
      renderFiscalYearDetailsContainer();

      FiscalYearDetails.mock.calls[0][0].openLedger({}, { id: 'ledgerId' });

      expect(historyMock.push).toHaveBeenCalledWith(`${LEDGERS_ROUTE}/ledgerId/view`);
    });

    it('should remove', () => {
      mutatorMock.fiscalYear.DELETE.mockReturnValue(Promise.resolve({}));
      renderFiscalYearDetailsContainer();

      FiscalYearDetails.mock.calls[0][0].onRemove();

      expect(mutatorMock.fiscalYear.DELETE).toHaveBeenCalled();
    });
  });
});

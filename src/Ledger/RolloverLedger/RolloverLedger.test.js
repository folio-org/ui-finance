import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { ORDER_TYPE } from '../constants';
import RolloverLedger from './RolloverLedger';
import { LEDGER_ROLLOVER_TYPES } from '../../common/const';

const CURRENT_FISCAL_YEAR = {
  'id': '684b5dc5-92f6-4db7-b996-b549d88f5e4e',
  'acqUnitIds': [],
  'name': 'Fiscal Year 2020',
  'code': 'FY2020',
  'currency': 'USD',
  'description': 'Fiscal year for 2020',
  'periodStart': '2020-01-01T00:00:00.000+0000',
  'periodEnd': '2020-12-31T23:59:59.000+0000',
  'series': 'FY',
};

const defaultProps = {
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  initialValues: {},
  goToCreateFY: jest.fn(),
};

const renderRolloverLedger = (props = {}) => render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <RolloverLedger
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  </IntlProvider>,
);

describe('RolloverLedger', () => {
  beforeEach(() => {
    defaultProps.onSubmit.mockClear();
  });

  it('should display form with budgets', () => {
    const initialValues = {
      budgetsRollover: [{
        fundTypeId: 'a6cffa87-7a64-4419-83d6-fa7af9d120e2',
      }],
      encumbrancesRollover: [],
    };
    const fundTypesMap = new Map([[
      'a6cffa87-7a64-4419-83d6-fa7af9d120e2',
      {
        id: 'a6cffa87-7a64-4419-83d6-fa7af9d120e2',
        name: 'Monographs',
      },
    ]]);

    renderRolloverLedger({ fundTypesMap, initialValues });
    expect(screen.getByText('Monographs')).toBeDefined();
  });

  it('should display form with fiscal years information', () => {
    const initialValues = {
      ledgerId: '7cef8378-7cbd-1fae-bcdd-8b9d7c0af9de',
      budgetsRollover: [],
      encumbrancesRollover: [],
    };

    renderRolloverLedger({ currentFiscalYear: CURRENT_FISCAL_YEAR, initialValues });
    expect(screen.getByText('2020-01-01')).toBeDefined();
  });

  it('should display form with encumbrances info', () => {
    const initialValues = {
      ledgerId: '7cef8378-7cbd-1fae-bcdd-8b9d7c0af9de',
      budgetsRollover: [],
      encumbrancesRollover: Object.values(ORDER_TYPE).map((orderType) => ({ orderType })),
    };

    renderRolloverLedger({ initialValues });
    expect(screen.getByText('ui-finance.ledger.rollover.orderType.onetime')).toBeDefined();
  });

  it('should display test rollover button', () => {
    const initialValues = {
      ledgerId: '7cef8378-7cbd-1fae-bcdd-8b9d7c0af9de',
      budgetsRollover: [],
      encumbrancesRollover: [],
    };

    renderRolloverLedger({ currentFiscalYear: CURRENT_FISCAL_YEAR, initialValues });
    expect(screen.getByText('ui-finance.ledger.rollover.testBtn')).toBeDefined();
  });

  describe('Rollover Ledger submit', () => {
    beforeEach(async () => {
      const initialValues = {
        ledgerId: '7cef8378-7cbd-1fae-bcdd-8b9d7c0af9de',
        fromFiscalYearId: CURRENT_FISCAL_YEAR.id,
        budgetsRollover: [],
        encumbrancesRollover: [],
      };

      renderRolloverLedger({
        currentFiscalYear: CURRENT_FISCAL_YEAR,
        initialValues,
        fiscalYears: [{
          code: 'TY2022',
          id: 'test-id',
          periodStart: '2023-01-01T00:00:00.000+0000',
        }],
      });

      const FYSelect = screen.getByRole('combobox', { name: 'ui-finance.budget.fiscalYear' });

      await act(async () => user.selectOptions(FYSelect, ['test-id']));
    });

    it('should call \'handleSubmit\' for rollover when \'Rollover\' btn was clicked', async () => {
      await act(async () => user.click(screen.getByText('ui-finance.ledger.rollover.saveBtn')));

      expect(defaultProps.onSubmit).toBeCalled();
    });

    it('should call \'handleSubmit\' for rollover preview when \'Test rollover\' btn was clicked', async () => {
      await act(async () => user.click(screen.getByText('ui-finance.ledger.rollover.testBtn')));

      expect(defaultProps.onSubmit).toBeCalled();
    });
  });
});

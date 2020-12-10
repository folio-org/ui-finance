import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { ORDER_TYPE } from '../constants';
import RolloverLedger from './RolloverLedger';

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

const renderRolloverLedger = ({
  currentFiscalYear,
  fundTypesMap,
  ledger,
  onSubmit = () => { },
  onCancel = () => { },
  initialValues = {},
  goToCreateFY = () => { },
}) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <RolloverLedger
        currentFiscalYear={currentFiscalYear}
        fundTypesMap={fundTypesMap}
        goToCreateFY={goToCreateFY}
        initialValues={initialValues}
        ledger={ledger}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('RolloverLedger', () => {
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
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import '@folio/stripes-acq-components/test/jest/__mock__';

import RolloverLedger from './RolloverLedger';

const renderRolloverLedger = ({
  fundTypesMap,
  ledger,
  onSubmit = () => { },
  onCancel = () => { },
  initialValues = {},
}) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <RolloverLedger
        fundTypesMap={fundTypesMap}
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
    const initialValues = { budgetsRollover: [{
      fundTypeId: 'a6cffa87-7a64-4419-83d6-fa7af9d120e2',
    }] };
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
});

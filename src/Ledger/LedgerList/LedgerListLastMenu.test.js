import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import LedgerListLastMenu from './LedgerListLastMenu';

const renderLedgerListLastMenu = () => render(
  <LedgerListLastMenu />,
  { wrapper: MemoryRouter },
);

describe('LedgerListLastMenu', () => {
  it('should render ledger list last menu', async () => {
    const { getByTestId } = renderLedgerListLastMenu();

    expect(getByTestId('create-ledger-button')).toBeDefined();
    expect(getByTestId('view-batch-allocation-logs-button')).toBeDefined();
  });
});

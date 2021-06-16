import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import LedgerListLastMenu from './LedgerListLastMenu';

const renderLedgerListLastMenu = () => render(
  <LedgerListLastMenu />,
  { wrapper: MemoryRouter },
);

describe('LedgerListLastMenu', () => {
  it('should render ledger list last menu', async () => {
    const { getByText } = renderLedgerListLastMenu();

    expect(getByText('stripes-smart-components.new')).toBeDefined();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FundsListLastMenu from './FundsListLastMenu';

const renderFundsListLastMenu = () => render(
  <FundsListLastMenu />,
  { wrapper: MemoryRouter },
);

describe('FiscalYearsListLastMenu', () => {
  it('should render fund list last menu', async () => {
    const { getByText } = renderFundsListLastMenu();

    expect(getByText('stripes-smart-components.new')).toBeDefined();
  });
});

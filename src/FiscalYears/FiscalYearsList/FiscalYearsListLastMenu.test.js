import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FiscalYearsListLastMenu from './FiscalYearsListLastMenu';

const renderFiscalYearsListLastMenu = () => render(
  <FiscalYearsListLastMenu />,
  { wrapper: MemoryRouter },
);

describe('FiscalYearsListLastMenu', () => {
  it('should render fiscal year list last menu', async () => {
    const { getByText } = renderFiscalYearsListLastMenu();

    expect(getByText('stripes-smart-components.new')).toBeDefined();
  });
});

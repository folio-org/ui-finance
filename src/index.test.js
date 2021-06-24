import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import Finance from '.';

jest.mock('@folio/stripes-smart-components/lib/Settings', () => jest.fn().mockReturnValue('Settings'));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockReturnValue({}),
  useRouteMatch: jest.fn().mockReturnValue({}),
}));

const renderFinance = (props = {}) => render(<Finance {...props} />, { wrapper: MemoryRouter });

describe('Finance component', () => {
  it('should display settings', async () => {
    renderFinance({ showSettings: true });

    await screen.findByText('Settings');

    expect(screen.getByText('Settings')).toBeDefined();
  });
});

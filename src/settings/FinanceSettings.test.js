import React from 'react';
import { render, screen } from '@testing-library/react';

import FinanceSettings from './FinanceSettings';

jest.mock('@folio/stripes-smart-components/lib/Settings', () => jest.fn().mockReturnValue('Settings'));

const renderFinanceSettings = () => render(<FinanceSettings />);

describe('FinanceSettings component', () => {
  it('should display settings', async () => {
    renderFinanceSettings();

    await screen.findByText('Settings');

    expect(screen.getByText('Settings')).toBeDefined();
  });
});

import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import LedgerFunds from './LedgerFunds';

jest.mock('../../common/RelatedFunds/RelatedFunds', () => jest.fn().mockReturnValue('RelatedFunds'));

const renderFinanceSettings = () => render(<LedgerFunds fiscalYearId="fyId" ledgerId="ledgerId" />);

describe('LedgerFunds component', () => {
  it('should display RelatedFunds', async () => {
    renderFinanceSettings();

    await screen.findByText('RelatedFunds');

    expect(screen.getByText('RelatedFunds')).toBeDefined();
  });
});

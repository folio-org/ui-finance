import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { OVERALL_ROLLOVER_STATUS } from '../../../common/const';
import LedgerRolloverProgress from './LedgerRolloverProgress';

const LEDGER_NAME = 'test ledger';

const renderComponent = ({
  ledgerName,
  fromYearCode,
  rolloverStatus,
  onClose = () => { },
}) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <LedgerRolloverProgress
        fromYearCode={fromYearCode}
        ledgerName={ledgerName}
        onClose={onClose}
        rolloverStatus={rolloverStatus}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('LedgerRolloverProgress', () => {
  it('should display ledger name', () => {
    renderComponent({ ledgerName: LEDGER_NAME });
    expect(screen.getByText(LEDGER_NAME)).toBeDefined();
  });

  it('should display progress bar', () => {
    const { container } = renderComponent({
      rolloverStatus: { budgetsClosingRolloverStatus: OVERALL_ROLLOVER_STATUS.inProgress },
    });

    expect(container.querySelector('[data-test-progress-bar]')).toBeDefined();
  });
});

import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import { RolloverLogsFilters } from './RolloverLogsFilters';

jest.useFakeTimers('modern');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ search: '' })),
}));
jest.mock('@folio/stripes-core/src/useOkapiKy', () => jest.fn(() => ({})));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderRolloverLogsFilters = (props = {}) => render(
  <RolloverLogsFilters
    {...defaultProps}
    {...props}
  />,
);

describe('RolloverLogsFilters', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: jest.fn(() => ({
        json: () => Promise.resolve({}),
      })),
    });
  });

  it('should display rollover logs filters', async () => {
    renderRolloverLogsFilters();

    expect(screen.getByText('ui-finance.ledger.rollover.logs.startDate')).toBeDefined();
    expect(screen.getByText('ui-finance.ledger.rollover.logs.endDate')).toBeDefined();
    expect(screen.getByText('ui-finance.ledger.rollover.logs.status')).toBeDefined();
    expect(screen.getByText('ui-finance.ledger.rollover.logs.source')).toBeDefined();
  });

  describe('Filtering', () => {
    beforeEach(() => {
      defaultProps.applyFilters.mockClear();
    });

    it('should apply \'Start time\' filter when date range was applied', async () => {
      renderRolloverLogsFilters();

      const fromInputs = screen.getAllByRole('textbox', { name: 'stripes-smart-components.dateRange.from' });
      const toInputs = screen.getAllByRole('textbox', { name: 'stripes-smart-components.dateRange.to' });
      const applyBtns = screen.getAllByRole('button', { name: 'stripes-smart-components.dateRange.apply' });

      user.type(fromInputs[0], '07/14/2022');
      user.type(toInputs[0], '07/15/2022');
      user.click(applyBtns[0]);

      expect(defaultProps.applyFilters).toHaveBeenCalled();
    });

    it('should apply \'End time\' filter when date range was applied', async () => {
      renderRolloverLogsFilters();

      const fromInputs = screen.getAllByRole('textbox', { name: 'stripes-smart-components.dateRange.from' });
      const toInputs = screen.getAllByRole('textbox', { name: 'stripes-smart-components.dateRange.to' });
      const applyBtns = screen.getAllByRole('button', { name: 'stripes-smart-components.dateRange.apply' });

      user.type(fromInputs[1], '07/14/2022');
      user.type(toInputs[1], '07/15/2022');
      user.click(applyBtns[1]);

      expect(defaultProps.applyFilters).toHaveBeenCalled();
    });

    it('should apply \'Status\' filter when \'Successful\' checkbox was clicked', async () => {
      renderRolloverLogsFilters();

      user.click(screen.getByRole('checkbox', { name: 'ui-finance.ledger.rollover.status.success' }));

      expect(defaultProps.applyFilters).toHaveBeenCalled();
    });

    it('should apply \'Source\' filter when \'Rollover test\' checkbox was clicked', async () => {
      renderRolloverLogsFilters();

      user.click(screen.getByRole('checkbox', { name: 'ui-finance.ledger.rollover.rolloverTest' }));

      expect(defaultProps.applyFilters).toHaveBeenCalled();
    });
  });
});

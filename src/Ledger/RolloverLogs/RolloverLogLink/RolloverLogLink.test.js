import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { useOkapiKy } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import { exportReport } from '../../../../test/jest/fixtures/export';
import {
  rolloverLogs,
  rolloverErrors,
} from '../../../../test/jest/fixtures/rollover';
import {
  exportRolloverErrors,
  exportRolloverResult,
  generateBudgetsReport,
} from '../../../common/utils';
import { RolloverLogLink } from './RolloverLogLink';
import { LEDGER_ROLLOVER_LINK_TYPES } from '../constants';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(() => jest.fn()),
}));
jest.mock('../../../common/utils', () => ({
  ...jest.requireActual('../../../common/utils'),
  exportRolloverErrors: jest.fn(),
  exportRolloverResult: jest.fn(),
  generateBudgetsReport: jest.fn(),
}));

const defaultProps = {
  type: LEDGER_ROLLOVER_LINK_TYPES.result,
  rolloverLog: rolloverLogs[0],
};

const getMockedKy = ({ data, isResolved = true }) => ({
  get: () => ({
    json: () => Promise[isResolved ? 'resolve' : 'reject']({ data }),
  }),
});

const renderRolloverLogs = (props = {}) => render(
  <RolloverLogLink
    {...defaultProps}
    {...props}
  />,
);

describe('RolloverLogLink', () => {
  beforeEach(() => {
    exportRolloverErrors.mockClear();
    exportRolloverResult.mockClear();
    generateBudgetsReport.mockClear();
    useShowCallout.mockClear();

    useOkapiKy
      .mockClear()
      .mockReturnValue(getMockedKy({ data: exportReport }));
  });

  it('should display result link for successful rollover', () => {
    renderRolloverLogs();

    expect(screen.getByText(/-result/)).toBeInTheDocument();
  });

  it('should not display error link for successful rollover', () => {
    renderRolloverLogs({ type: LEDGER_ROLLOVER_LINK_TYPES.error });

    expect(screen.queryByText(/-error/)).not.toBeInTheDocument();
  });

  it('should display error link for failed rollover', () => {
    renderRolloverLogs({
      type: LEDGER_ROLLOVER_LINK_TYPES.error,
      rolloverLog: rolloverLogs[2],
    });

    expect(screen.getByText(/-error/)).toBeInTheDocument();
  });

  it('should display result link for failed rollover', () => {
    renderRolloverLogs({
      type: LEDGER_ROLLOVER_LINK_TYPES.result,
      rolloverLog: rolloverLogs[2],
    });

    expect(screen.getByText(/-result/)).toBeInTheDocument();
  });

  it('should NOT display link to result if rollover in progress', () => {
    renderRolloverLogs({
      type: LEDGER_ROLLOVER_LINK_TYPES.result,
      rolloverLog: rolloverLogs[1],
    });

    expect(screen.queryByText(/-error/)).not.toBeInTheDocument();
  });

  it('should NOT display link to errors if rollover in progress', () => {
    renderRolloverLogs({
      type: LEDGER_ROLLOVER_LINK_TYPES.error,
      rolloverLog: rolloverLogs[1],
    });

    expect(screen.queryByText(/-error/)).not.toBeInTheDocument();
  });

  describe('Actions:', () => {
    it('should start export rollover results', async () => {
      renderRolloverLogs();

      const link = screen.getByTestId('rollover-log-link');

      await act(async () => user.click(link));

      expect(generateBudgetsReport).toHaveBeenCalled();
      expect(exportRolloverResult).toHaveBeenCalled();
    });

    it('should start export rollover errors', async () => {
      useOkapiKy.mockReturnValue(getMockedKy({ data: rolloverErrors }));

      renderRolloverLogs({
        type: LEDGER_ROLLOVER_LINK_TYPES.error,
        rolloverLog: rolloverLogs[2],
      });

      const link = screen.getByTestId('rollover-log-link');

      await act(async () => user.click(link));

      expect(exportRolloverErrors).toHaveBeenCalled();
    });

    it('should show error message if an error occurs during export', async () => {
      const showCallout = jest.fn();

      useShowCallout.mockReturnValue(showCallout);
      useOkapiKy.mockReturnValue(getMockedKy({ isResolved: false }));

      renderRolloverLogs({
        type: LEDGER_ROLLOVER_LINK_TYPES.error,
        rolloverLog: rolloverLogs[2],
      });

      const link = screen.getByTestId('rollover-log-link');

      await act(async () => user.click(link));

      expect(showCallout).toHaveBeenCalled();
    });
  });
});

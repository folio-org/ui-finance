import { act, render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

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
    useShowCallout.mockClear();

    useOkapiKy
      .mockClear()
      .mockReturnValue(getMockedKy({ data: exportReport }));
  });

  it('should display link for rollover result', () => {
    renderRolloverLogs();

    expect(screen.getByText(/-result/)).toBeInTheDocument();
  });

  it('should display link for rollover error', () => {
    renderRolloverLogs({
      type: LEDGER_ROLLOVER_LINK_TYPES.error,
      rolloverLog: rolloverLogs[2],
    });

    expect(screen.getByText(/-error/)).toBeInTheDocument();
  });

  it('should NOT display link to result or error if rollover in progress', () => {
    renderRolloverLogs({ rolloverLog: rolloverLogs[1] });

    expect(screen.queryByText(/-result/)).not.toBeInTheDocument();
  });

  describe('Actions:', () => {
    // TODO: uncoment after results export implementation
    // it('should start export rollover results', async () => {
    //   renderRolloverLogs();

    //   const link = screen.getByTestId('rollover-log-link');

    //   await act(async () => user.click(link));

    //   expect(exportRolloverResult).toHaveBeenCalled();
    // });

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

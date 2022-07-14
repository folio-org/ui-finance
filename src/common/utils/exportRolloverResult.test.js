import { exportToCsv } from '@folio/stripes/components';

import { exportReport } from '../../../test/jest/fixtures/export';
import { exportRolloverResult } from './exportRolloverResult';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  exportToCsv: jest.fn(),
}));

describe('exportRolloverResult', () => {
  it('should call function that convert budgets data to CSV and exports it', () => {
    exportRolloverResult({ data: exportReport, filename: 'results-report' });

    expect(exportToCsv).toHaveBeenCalled();
  });
});

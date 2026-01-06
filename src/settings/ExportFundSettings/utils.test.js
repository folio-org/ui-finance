import { exportToCsv } from '@folio/stripes/components';

import { exportCsvFunds } from './utils';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  exportToCsv: jest.fn(),
}));

describe('exportCsvFunds', () => {
  it('should call exportToCsv with correct parameters', () => {
    exportCsvFunds('FY2025');

    expect(exportToCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({
        header: false,
        filename: expect.stringContaining('fund-codes-export-FY2025-'),
      }),
    );
  });
});

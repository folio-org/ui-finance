import { exportToCsv } from '@folio/stripes/components';

import { rolloverErrors } from '../../../test/jest/fixtures/rollover';
import { exportRolloverErrors } from './exportRolloverErrors';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  exportToCsv: jest.fn(),
}));

describe('exportRolloverErrors', () => {
  it('should call function that convert errors data to CSV and exports it', () => {
    exportRolloverErrors({ errors: rolloverErrors, filename: 'errors-report' });

    expect(exportToCsv).toHaveBeenCalled();
  });
});

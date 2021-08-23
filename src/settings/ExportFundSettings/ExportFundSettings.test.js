import React from 'react';
import { render, screen, act } from '@testing-library/react';
import user from '@testing-library/user-event';

import ExportFundSettings from './ExportFundSettings';
import { useFiscalYearOptions } from './useFiscalYearOptions';
import { useExportFund } from './useExportFund';

jest.mock('./useFiscalYearOptions', () => ({
  useFiscalYearOptions: jest.fn(),
}));
jest.mock('./useExportFund', () => ({ useExportFund: jest.fn() }));
jest.mock('@folio/stripes-util/lib/exportCsv', () => jest.fn());
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

const code = 'FY2021';
const fetchExportFund = jest.fn().mockReturnValue(Promise.resolve({ fundCodeVsExpClassesTypes: [] }));

const renderExportFundSettings = () => render(<ExportFundSettings />);

describe('ExportFundSettings', () => {
  beforeEach(() => {
    useFiscalYearOptions.mockClear().mockReturnValue({ fiscalYearOptions: [{ value: code, label: code }] });
    useExportFund.mockClear().mockReturnValue({ fetchExportFund });
  });

  it('should display ExportFundSettings', async () => {
    await act(async () => renderExportFundSettings());

    expect(screen.getByText('ui-finance.settings.exportFund.helperText')).toBeDefined();
  });

  it('export button should be disabled', async () => {
    await act(async () => renderExportFundSettings());

    expect(screen.getByTestId('export-fund-button')).toHaveAttribute('disabled');
  });

  it('should select fiscal year', async () => {
    await act(async () => renderExportFundSettings());

    user.selectOptions(screen.getByRole('combobox'), code);

    expect(screen.getByText(code).selected).toBe(true);
    expect(screen.getByTestId('export-fund-button')).not.toHaveAttribute('disabled');
  });

  it('should run export', async () => {
    await act(async () => renderExportFundSettings());

    user.selectOptions(screen.getByRole('combobox'), code);
    user.click(screen.getByTestId('export-fund-button'));

    expect(fetchExportFund).toHaveBeenCalled();
  });
});

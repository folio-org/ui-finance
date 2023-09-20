import React from 'react';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import ExportSettingsModal from './ExportSettingsModal';

const FY = {
  id: 'fyId',
  code: 'FY2022',
  series: 'FY',
};

const defaultProps = {
  fiscalYear: FY,
  onSubmit: jest.fn(),
  handleSubmit: jest.fn(),
  onCancel: jest.fn(),
  initialValues: { fiscalYearId: 'fiscalYearId' },
  values: { fiscalYearId: 'fiscalYearId' },
};

const renderExportSettingsModal = (props = {}) => render(
  <Form
    onSubmit={jest.fn()}
    render={() => (
      <ExportSettingsModal
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper: MemoryRouter },
);

describe('ExportSettingsModal', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.handleSubmit.mockClear();
  });

  it('should render Export Settings Modal elements', async () => {
    renderExportSettingsModal();

    expect(screen.getByText('ui-finance.exportCSV.exportSettings.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.exportCSV.exportSettings.message')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.budget.fiscalYear')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.exportCSV.exportSettings.expenseClasses')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.exportCSV.exportSettings.cancel')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.exportCSV.exportSettings.export')).toBeInTheDocument();
  });

  it('should call \'onSubmit\' when \'Export\' button was clicked', async () => {
    renderExportSettingsModal();

    await user.click(screen.getByRole('button', { name: 'ui-finance.exportCSV.exportSettings.export' }));

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('should call \'onCancel\' when \'Cancel\' button was clicked', async () => {
    renderExportSettingsModal();

    await user.click(screen.getByRole('button', { name: 'ui-finance.exportCSV.exportSettings.cancel' }));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});

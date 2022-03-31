import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { ExportSettingsModal } from './ExportSettingsModal';

const defaultProps = {
  onExportCSV: jest.fn(),
  onCancel: jest.fn(),
  open: true,
};

const renderExportSettingsModal = (props = {}) => render(
  <ExportSettingsModal
    {...defaultProps}
    {...props}
  />,
);

describe('ExportSettingsModal', () => {
  it('should render Export Settings Modal', () => {
    renderExportSettingsModal();

    expect(screen.getByText('ui-finance.exportCSV.exportSettings.heading')).toBeInTheDocument();
  });
});

describe('ExportSettingsModal actions', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onExportCSV.mockClear();
  });

  it('should call \'onExportCSV\' when \'Export\' button was clicked', () => {
    renderExportSettingsModal();

    user.click(screen.getByText('ui-finance.exportCSV.exportSettings.export'));

    expect(defaultProps.onExportCSV).toHaveBeenCalled();
  });

  it('should close Export Settings Modal when \'Cancel\' button was clicked', () => {
    renderExportSettingsModal();

    user.click(screen.getByText('ui-finance.exportCSV.exportSettings.cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});

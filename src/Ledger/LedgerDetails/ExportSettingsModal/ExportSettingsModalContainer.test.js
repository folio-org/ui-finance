import React from 'react';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { ExportSettingsModalContainer } from './ExportSettingsModalContainer';

const FY = {
  id: 'fyId',
  code: 'FY2022',
  series: 'FY',
};

const defaultProps = {
  fiscalYear: FY,
  onCancel: jest.fn(),
  toggleModal: jest.fn(),
};

const renderExportSettingsModalContainer = (props = {}) => render(
  <Form
    onSubmit={jest.fn()}
    render={() => (
      <ExportSettingsModalContainer
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper: MemoryRouter },
);

describe('ExportSettingsModalContainer', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.toggleModal.mockClear();
  });

  it('should render Export Settings Modal', async () => {
    renderExportSettingsModalContainer();

    expect(screen.getByText('ui-finance.exportCSV.exportSettings.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.exportCSV.exportSettings.message')).toBeInTheDocument();
  });

  it('should call \'toggleModal\' when \'Export\' button was clicked', () => {
    renderExportSettingsModalContainer();

    user.click(screen.getByText('ui-finance.exportCSV.exportSettings.export'));

    expect(defaultProps.toggleModal).toHaveBeenCalled();
  });
});

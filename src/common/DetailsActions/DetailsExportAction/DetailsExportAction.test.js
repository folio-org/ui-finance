import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { DetailsExportAction } from './DetailsExportAction';

const defaultProps = {
  onExportCSV: jest.fn(),
  perm: 'perm',
  toggleActionMenu: jest.fn(),
};

const renderDetailsExportAction = (props = {}) => render(
  <DetailsExportAction
    {...defaultProps}
    {...props}
  />,
);

describe('DetailsExportAction', () => {
  it('should display action button', () => {
    renderDetailsExportAction();

    expect(screen.getByTestId('action-export-csv')).toBeInTheDocument();
  });

  it('should call \'onExportCSV\' when the button was clicked', async () => {
    renderDetailsExportAction();

    await user.click(screen.getByTestId('action-export-csv'));

    expect(defaultProps.onExportCSV).toHaveBeenCalled();
  });
});

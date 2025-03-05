import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import UploadAllocationWorksheetModalForm from './UploadAllocationWorksheetModalForm';

const defaultProps = {
  open: true,
  onSubmit: jest.fn(),
  toggle: jest.fn(),
};

const renderForm = (props = {}) => render(
  <UploadAllocationWorksheetModalForm
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('UploadAllocationWorksheetModalForm', () => {
  it('should render the modal with the correct heading', () => {
    renderForm();

    expect(screen.getByText('ui-finance.batchAllocations.uploadWorksheet.modal.heading')).toBeInTheDocument();
  });

  it('should call toggle on cancel', async () => {
    renderForm();

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.cancel' }));

    expect(defaultProps.toggle).toHaveBeenCalled();
  });

  it('should disable confirm button when form is pristine', () => {
    renderForm();

    expect(screen.getByRole('button', { name: 'stripes-core.button.confirm' })).toBeDisabled();
  });

  /* TODO: Temporarily hide this section for groups */
  xit('should show error message when file validation fails', async () => {
    renderForm();

    const fileInput = screen.getByTestId('file-uploader-input');
    const file = new File(['name,age,city\nJohn,25,New York\nAlice,30,Los Angeles'], 'invalid.csv', { type: 'text/csv' });

    await userEvent.upload(fileInput, file);

    expect(await screen.findByText('ui-finance.batchAllocations.uploadWorksheet.validation.error.requiredHeaders')).toBeInTheDocument();
  });
});

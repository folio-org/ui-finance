import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  ALLOCATION_WORKSHEET_REQUIRED_FIELDS,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS,
} from '../../../../const';
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
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should keep quoted values from parsed CSV data', async () => {
    const quotedValue = '"FY2025"';
    const requiredHeaders = ALLOCATION_WORKSHEET_REQUIRED_FIELDS.map(
      (field) => EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS[field],
    );
    const fiscalYearHeader = EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS.fiscalYear;
    const csvRow = requiredHeaders
      .map((header) => (header === fiscalYearHeader ? '"""FY2025"""' : `stub-${header}`))
      .join(',');
    const csvContent = `${requiredHeaders.join(',')}\n${csvRow}`;

    renderForm();

    const fileInput = screen.getByTestId('file-uploader-input');
    const file = new File([csvContent], 'valid.csv', { type: 'text/csv' });

    file.text = jest.fn().mockResolvedValue(csvContent);

    await userEvent.upload(fileInput, file);
    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.confirm' }));

    expect(defaultProps.onSubmit).toHaveBeenCalled();
    expect(defaultProps.onSubmit.mock.calls[0][0].file.data[0].fiscalYear).toBe(quotedValue);
  });

  // TODO: Enable after group batch allocation feature is created
  xit('should show error message when file validation fails', async () => {
    renderForm();

    const fileInput = screen.getByTestId('file-uploader-input');
    const file = new File(['name,age,city\nJohn,25,New York\nAlice,30,Los Angeles'], 'invalid.csv', { type: 'text/csv' });

    await userEvent.upload(fileInput, file);

    expect(await screen.findByText('ui-finance.batchAllocations.uploadWorksheet.validation.error.requiredHeaders')).toBeInTheDocument();
  });
});

import localforage from 'localforage';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';

import {
  BATCH_ALLOCATIONS_SOURCE,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS,
} from '../../../const';
import { UploadAllocationWorksheetModal } from './UploadAllocationWorksheetModal';

jest.mock('localforage');

const defaultProps = {
  open: true,
  toggle: jest.fn(),
  sourceType: BATCH_ALLOCATIONS_SOURCE.group,
};

const renderComponent = (props = {}) => render(
  <MemoryRouter>
    <UploadAllocationWorksheetModal
      {...defaultProps}
      {...props}
    />
  </MemoryRouter>,
);

describe('UploadAllocationWorksheetModal', () => {
  const headers = Object.values(EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS);
  const csvContent = `${headers.map(v => `"${v}"`)}\n${new Array(headers.length).fill('stub')}`;
  const fileToUpload = new File([csvContent], 'test.csv', { type: 'text/csv' });

  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: jest.fn(() => ({
        json: jest.fn(() => ({
          fiscalYears: [{ id: 'fiscalYearId' }],
        })),
      })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.batchAllocations.uploadWorksheet.modal.heading')).toBeInTheDocument();
  });

  it('should call toggle function when close button is clicked', async () => {
    renderComponent();

    await userEvent.click(screen.getByText('stripes-components.cancel'));

    expect(defaultProps.toggle).toHaveBeenCalled();
  });

  it('should handle form submission', async () => {
    renderComponent();

    await userEvent.upload(screen.getByTestId('file-uploader-input'), fileToUpload);
    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.confirm' }));

    expect(localforage.setItem).toHaveBeenCalled();
  });

  it('should not proceed if fiscal year ID is not found', async () => {
    useOkapiKy.mockReturnValue({
      get: jest.fn(() => ({
        json: jest.fn(() => ({
          fiscalYears: [],
        })),
      })),
    });

    renderComponent();

    await userEvent.upload(screen.getByTestId('file-uploader-input'), fileToUpload);
    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.confirm' }));

    expect(localforage.setItem).not.toHaveBeenCalled();
  });
});

import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import '@folio/stripes-acq-components/test/jest/__mock__';

import {
  useUnpaidInvoices,
  useUnpaidInvoicesExport,
} from '../hooks';
import UnpaidInvoiceListModal from './UnpaidInvoiceListModal';

jest.mock('../hooks', () => ({
  useUnpaidInvoices: jest.fn(),
  useUnpaidInvoicesExport: jest.fn(),
}));

const fiscalYear = {
  id: 'fyId',
  periodStart: '2021-01-01T00:00:00.000+00:00',
  periodEnd: '2021-12-31T00:00:00.000+00:00',
};

const renderUnpaidInvoiceListModal = ({
  onContinue,
  onCancel,
}) => (render(
  <UnpaidInvoiceListModal
    fiscalYear={fiscalYear}
    onCancel={onCancel}
    onContinue={onContinue}
  />,
));

describe('UnpaidInvoiceListModal', () => {
  let onCancel;
  let onContinue;

  beforeEach(() => {
    useUnpaidInvoices.mockClear().mockReturnValue({
      invoices: [{ currency: 'USD', vendorInvoiceNo: '1', invoiceTotal: 10 }],
      totalRecords: 1,
      isFetching: false,
    });
    useUnpaidInvoicesExport.mockClear().mockReturnValue({
      runExportCSV: jest.fn(),
      isLoading: false,
    });

    onCancel = jest.fn().mockClear();
    onContinue = jest.fn().mockClear();
  });

  it('should display modal header', () => {
    renderUnpaidInvoiceListModal({ onCancel, onContinue });

    expect(screen.getByText('ui-finance.invoice.unpaidInvoices')).toBeDefined();
    expect(screen.getByText('ui-finance.invoice.unpaidInvoices.header')).toBeDefined();
  });

  it('should call onCancel prop', async () => {
    renderUnpaidInvoiceListModal({ onCancel, onContinue });

    await user.click(screen.getByText('ui-finance.cancel'));

    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onContinue prop', async () => {
    renderUnpaidInvoiceListModal({ onCancel, onContinue });

    await user.click(screen.getByText('ui-finance.continue'));

    expect(onContinue).toHaveBeenCalled();
  });
});

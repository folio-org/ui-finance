import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import moment from 'moment';

import { exportToCsv } from '@folio/stripes/components';
import {
  useOkapiKy,
  useNamespace,
  useStripes,
} from '@folio/stripes/core';
import {
  EXPORT_INVOICE_FIELDS,
  EXPORT_INVOICE_LINE_FIELDS,
  getInvoiceExportData,
} from '@folio/stripes-acq-components';

export const useUnpaidInvoicesExport = () => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const { currency } = useStripes();
  const [namespace] = useNamespace({ key: 'unpaid-invoices-export-csv' });

  const mutationKey = [namespace];
  const mutationFn = async ({ query }) => {
    const exportData = await getInvoiceExportData({ ky, intl, query, currency });

    const filename = `unpaid-invoice-export-${moment().format('YYYY-MM-DD-hh:mm')}`;

    exportToCsv(
      [{ ...EXPORT_INVOICE_FIELDS, ...EXPORT_INVOICE_LINE_FIELDS }, ...exportData],
      {
        header: false,
        filename,
      },
    );
  };

  const {
    isLoading,
    mutateAsync: runExportCSV,
  } = useMutation({ mutationKey, mutationFn });

  return {
    runExportCSV,
    isLoading,
  };
};

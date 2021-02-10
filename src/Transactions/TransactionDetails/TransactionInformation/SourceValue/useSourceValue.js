import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  LINES_API,
  INVOICES_API,
} from '@folio/stripes-acq-components';

import { TRANSACTION_SOURCE } from '../../../constants';

export const useSourceValue = (transaction) => {
  const ky = useOkapiKy();
  const isInvoiceSource = transaction.source === TRANSACTION_SOURCE.invoice;

  const { isLoading: isInvoiceLoading, data: invoice } = useQuery(
    transaction.id,
    () => ky(`${INVOICES_API}/${transaction.sourceInvoiceId}`).json(),
    { enabled: isInvoiceSource },
  );

  const { isLoading: isPoLineLoading, data: poLine } = useQuery(
    transaction.id,
    () => ky(`${LINES_API}/${transaction.encumbrance?.sourcePoLineId}`).json(),
    { enabled: transaction.source === TRANSACTION_SOURCE.poLine },
  );

  return ({
    isLoading: isInvoiceLoading || isPoLineLoading,
    sourceValue: isInvoiceSource ? invoice?.folioInvoiceNo : poLine?.poLineNumber,
  });
};

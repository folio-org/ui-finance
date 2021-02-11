import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  LINES_API,
  INVOICES_API,
} from '@folio/stripes-acq-components';

import { TRANSACTION_SOURCE } from '../../../constants';

const queryFnsMap = {
  [TRANSACTION_SOURCE.invoice]: async (ky, transaction) => {
    const { folioInvoiceNo } = await ky(`${INVOICES_API}/${transaction.sourceInvoiceId}`).json();

    return folioInvoiceNo;
  },
  [TRANSACTION_SOURCE.poLine]: async (ky, transaction) => {
    const { poLineNumber } = await ky(`${LINES_API}/${transaction.encumbrance?.sourcePoLineId}`).json();

    return poLineNumber;
  },
  [TRANSACTION_SOURCE.user]: () => TRANSACTION_SOURCE.user,
  [TRANSACTION_SOURCE.fiscalYear]: () => TRANSACTION_SOURCE.fiscalYear,
};

export const useSourceValue = (transaction) => {
  const ky = useOkapiKy();

  let result = { isLoading: false, data: null };

  const queryFn = queryFnsMap[transaction.source];

  result = useQuery(['finance', 'transaction-source-value', transaction.id], () => queryFn(ky, transaction));

  return result;
};

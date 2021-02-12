import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  LINES_API,
  INVOICES_API,
} from '@folio/stripes-acq-components';

import { TRANSACTION_SOURCE } from '../../../constants';
import { getSourceLink } from './utils';

const queryFnsMap = {
  [TRANSACTION_SOURCE.invoice]: async (ky, transaction) => {
    const { folioInvoiceNo } = await ky(`${INVOICES_API}/${transaction.sourceInvoiceId}`).json();

    return folioInvoiceNo;
  },
  [TRANSACTION_SOURCE.poLine]: async (ky, transaction) => {
    const { poLineNumber } = await ky(`${LINES_API}/${transaction.encumbrance?.sourcePoLineId}`).json();

    return poLineNumber;
  },
};

export const useSource = (transaction, intl) => {
  const ky = useOkapiKy();
  const sourceLink = useMemo(() => getSourceLink(transaction), [transaction]);

  const queryFn = queryFnsMap[transaction.source];

  const { isLoading, data } = useQuery(['finance', 'transaction-source-value', transaction.id], () => queryFn(ky, transaction));

  return ({
    isLoading,
    sourceLink,
    sourceValue: data || intl.formatMessage({ id: `ui-finance.transaction.source.${transaction.source}` }),
  });
};

import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { Loading } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import {
  LINES_API,
  INVOICES_API,
} from '@folio/stripes-acq-components';

import { TRANSACTION_SOURCE } from '../../../constants';
import { getSourceLink } from './utils';

const queryFnsMap = {
  [TRANSACTION_SOURCE.invoice]: async (ky, transaction) => {
    const { vendorInvoiceNo } = await ky(`${INVOICES_API}/${transaction.sourceInvoiceId}`).json();

    return vendorInvoiceNo;
  },
  [TRANSACTION_SOURCE.poLine]: async (ky, transaction) => {
    const { poLineNumber } = await ky(`${LINES_API}/${transaction.encumbrance?.sourcePoLineId}`).json();

    return poLineNumber;
  },
};

export const useSourceLink = (transaction, intl) => {
  const ky = useOkapiKy();
  const sourceLink = getSourceLink(transaction);

  const queryFn = queryFnsMap[transaction.source];

  const { isLoading, data } = useQuery(
    ['finance', 'transaction-source-value', transaction.id],
    () => queryFn(ky, transaction),
    { enabled: Boolean(queryFn) },
  );

  if (isLoading) return <Loading />;

  return (
    sourceLink && (
      <Link
        data-testid="transaction-source-link"
        to={sourceLink}
      >
        {data || intl.formatMessage({ id: `ui-finance.transaction.source.${transaction.source}` })}
      </Link>
    )
  );
};

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
  [TRANSACTION_SOURCE.invoice]: async (ky, transaction, signal) => {
    const { vendorInvoiceNo } = await ky.get(`${INVOICES_API}/${transaction.sourceInvoiceId}`, { signal }).json();

    return vendorInvoiceNo;
  },
  [TRANSACTION_SOURCE.poLine]: async (ky, transaction, signal) => {
    const { poLineNumber } = await ky.get(`${LINES_API}/${transaction.encumbrance?.sourcePoLineId}`, { signal }).json();

    return poLineNumber;
  },
};

export const useSourceLink = (transaction, intl) => {
  const ky = useOkapiKy();
  const sourceLink = getSourceLink(transaction);

  const queryFn = queryFnsMap[transaction.source];

  const { isLoading, data } = useQuery(
    ['finance', 'transaction-source-value', transaction.id],
    ({ signal }) => queryFn(ky, transaction, signal),
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

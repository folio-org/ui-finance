import { useState } from 'react';
import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  batchRequest,
  INVOICES_API,
  RESULT_COUNT_INCREMENT,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import { INVOICE_STATUS } from '../../../constants';

export const useUnpaidInvoices = (fy = {}, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'unpaid-invoices' });
  const [pagination, setPagination] = useState({ limit: RESULT_COUNT_INCREMENT, timestamp: new Date(), offset: 0 });

  const searchParams = {
    limit: pagination.limit,
    offset: pagination.offset,
    query: `(metadata.createdDate>=${fy.periodStart} and metadata.createdDate<=${fy.periodEnd}) and
      (status=="${INVOICE_STATUS.open}" or status=="${INVOICE_STATUS.approved}" or status=="${INVOICE_STATUS.reviewed}")
      sortby metadata.createdDate/sort.descending`,
  };

  const { data = {}, isFetching } = useQuery(
    [namespace, pagination.timestamp, pagination.limit, pagination.offset],
    async () => {
      const unpaidInvoices = await ky.get(INVOICES_API, { searchParams }).json();
      const vendorIds = [...new Set(unpaidInvoices?.invoices?.map(({ vendorId }) => vendorId))];
      const vendors = await batchRequest(
        async ({ params }) => {
          const { organizations = [] } = await ky.get(VENDORS_API, { searchParams: params }).json();

          return organizations;
        },
        vendorIds,
      );
      const vendorsMap = vendors.reduce((acc, vendor) => {
        acc[vendor.id] = vendor;

        return acc;
      }, {});

      return ({
        ...unpaidInvoices,
        invoices: unpaidInvoices?.invoices?.map(invoice => ({
          ...invoice,
          vendor: vendorsMap[invoice.vendorId],
        })),
      });
    },
    {
      enabled: Boolean(fy.periodStart && fy.periodEnd),
      ...options,
    },
  );

  return ({
    invoices: data?.invoices || [],
    isFetching,
    pagination,
    setPagination,
    totalRecords: data?.totalRecords,
  });
};

import { useOkapiKy } from '@folio/stripes/core';
import {
  fetchAllRecords,
  FUNDS_API,
} from '@folio/stripes-acq-components';

import { fetchFinanceData } from '../../utils';

export const useBatchAllocations = async ({ ledger }) => {
  const ky = useOkapiKy();

  // try {
  //   const { fyFinanceData } = await fetchFinanceData(ky)({
  //     searchParams: {
  //       query: `fiscalYearId=="${selectedFiscalYear}" and ledgerId=="${ledger.id}"`,
  //       limit: LIMIT_MAX,
  //     },
  //   });
  // } catch (error) {
  //   // eslint-disable-next-line no-console
  //   console.error(error);
  // }

  const funds = await fetchAllRecords(
    {
      GET: async ({ params: searchParams }) => {
        const { funds: fundsResponse } = await ky.get(FUNDS_API, { searchParams }).json();

        return fundsResponse;
      },
    },
    `ledgerId==${ledger.id}`,
  );

  return funds;
};

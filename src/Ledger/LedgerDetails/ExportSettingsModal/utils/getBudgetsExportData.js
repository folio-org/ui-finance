import { keyBy } from 'lodash';

import { fetchAllRecords } from '@folio/stripes-acq-components';

import { BUDGETS_API } from '../../../../common/const';

export const getBudgetsExportData = (ky) => async ({
  fiscalYearId,
  ledgerId,
}) => {
  const budgets = await fetchAllRecords(
    {
      GET: async ({ params: searchParams }) => {
        const { budgets: budgetsResponse } = await ky.get(BUDGETS_API, { searchParams }).json();

        return budgetsResponse;
      },
    },
    [
      `fiscalYearId==${fiscalYearId}`,
      `fund.ledgerId==${ledgerId}`,
    ].join(' and '),
  );

  return keyBy(budgets, 'id');
};

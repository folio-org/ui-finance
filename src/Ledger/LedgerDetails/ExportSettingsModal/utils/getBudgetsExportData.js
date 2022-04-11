import { keyBy } from 'lodash';

import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { BUDGETS_API } from '../../../../common/const';

export const getBudgetsExportData = (ky) => async ({
  fiscalYearId,
  ledgerId,
}) => {
  const { budgets = [] } = await ky.get(BUDGETS_API, {
    searchParams: {
      limit: LIMIT_MAX,
      query: [
        `fiscalYearId==${fiscalYearId}`,
        `fund.ledgerId==${ledgerId}`,
      ].join(' and '),
    },
  }).json();

  return keyBy(budgets, 'id');
};

import { baseManifest } from '@folio/stripes-acq-components';

import { BUDGETS_API } from '../const';

export const budgetsResource = {
  ...baseManifest,
  path: BUDGETS_API,
  records: 'budgets',
};

export const budgetResource = {
  ...baseManifest,
  path: `${BUDGETS_API}/:{budgetId}`,
  POST: {
    path: BUDGETS_API,
  },
};

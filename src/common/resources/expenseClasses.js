import { baseManifest } from '@folio/stripes-acq-components';

import { EXPENSE_CLASSES_API } from '../const';

export const expenseClassesResource = {
  ...baseManifest,
  path: EXPENSE_CLASSES_API,
  records: 'expenseClasses',
};

import { exportToCsv } from '@folio/stripes/components';

import {
  EXPORT_BUDGET_FIELDS,
  EXPORT_EXPENSE_CLASS_FIELDS,
  EXPORT_FUND_FIELDS,
} from '../const';

export const exportRolloverResult = ({ data, filename }) => {
  return exportToCsv(
    [
      {
        ...EXPORT_FUND_FIELDS,
        ...EXPORT_BUDGET_FIELDS,
        ...EXPORT_EXPENSE_CLASS_FIELDS,
      },
      ...data,
    ],
    {
      excludeFields: ['id', 'metadata'],
      filename,
      header: false,
    },
  );
};

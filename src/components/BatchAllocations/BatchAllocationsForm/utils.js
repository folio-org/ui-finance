import omit from 'lodash/omit';

import {
  BATCH_ALLOCATION_COLUMNS,
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../constants';

export const getBatchAllocationColumnMapping = ({ intl }) => {
  return BATCH_ALLOCATION_COLUMNS.reduce((acc, column) => {
    return { ...acc, [column]: intl.formatMessage({ id: `ui-finance.transaction.allocation.batch.columns.${column}` }) };
  }, {});
};

export const getFormattedOptions = (intl, dataOptions) => dataOptions.map(({ labelId, ...rest }) => ({
  label: intl.formatMessage({ id: labelId }),
  ...rest,
}));

export const normalizeFInanceData = (fyFinanceData) => fyFinanceData.map((item) => ({
  ...omit(item, [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS._isMissed]),
  [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: parseFloat(item[BATCH_ALLOCATION_FIELDS.budgetAllocationChange]),
  [BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]: parseFloat(item[BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]),
  [BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]: parseFloat(item[BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]),
}));

import omit from 'lodash/omit';

import {
  ERROR_CODE_GENERIC,
  ResponseErrorsContainer,
} from '@folio/stripes-acq-components';

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

const emptyOrFloat = (value) => value && parseFloat(value);

export const normalizeFinanceFormData = (fyFinanceData) => fyFinanceData.map((item) => ({
  ...omit(item, [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS._isMissed]),
  [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: emptyOrFloat(item[BATCH_ALLOCATION_FIELDS.budgetAllocationChange]),
  [BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]: emptyOrFloat(
    item[BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance],
  ),
  [BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]: emptyOrFloat(
    item[BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure],
  ),
}));

export const handleRecalculateError = async (error, showCallout) => {
  const { handler } = await ResponseErrorsContainer.create(error?.response);
  const errorContainer = handler.getError();
  const errorCode = errorContainer.code;

  if (errorCode === ERROR_CODE_GENERIC) {
    showCallout({
      ...(
        errorContainer.message
          ? { message: errorContainer.message }
          : { messageId: 'ui-finance.allocation.batch.form.recalculate.error' }
      ),
      type: 'error',
    });
  }
};

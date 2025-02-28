import omit from 'lodash/omit';
import set from 'lodash/set';
import partition from 'lodash/partition';

import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../constants';

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
  const rawErrors = handler.originalResponseBody?.errors;

  const [parameterizedErrors, restErrors] = partition(rawErrors, (err) => err.parameters);

  const responseFormErrorsMap = parameterizedErrors
    .flatMap((err) => err.parameters.map((param) => ({
      field: param.key.replace('financeData', BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData),
      message: err.message,
    })))
    .reduce((acc, { field, message }) => {
      set(acc, field, message);

      return acc;
    }, {});

  if (restErrors[0]) {
    showCallout({
      ...(
        restErrors[0]?.message
          ? { message: restErrors[0].message }
          : { messageId: 'ui-finance.allocation.batch.form.recalculate.error' }
      ),
      type: 'error',
    });
  }

  return responseFormErrorsMap;
};

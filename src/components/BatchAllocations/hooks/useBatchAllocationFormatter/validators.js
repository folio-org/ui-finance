import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../../constants';

export const validateAllocationAfterField = (intl, rowIndex) => (value, allValues) => {
  const adjustment = allValues
    ?.[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]
    ?.[rowIndex]
    ?.[BATCH_ALLOCATION_FIELDS.budgetAllocationChange];

  return value && (adjustment > 0 && value < 0)
    ? intl.formatMessage({ id: 'ui-finance.allocation.batch.form.validation.error.negativeAllocation' })
    : undefined;
};

export const validateNumericValue = (intl) => (value) => {
  return value && Number.isNaN(Number(value))
    ? intl.formatMessage({ id: 'ui-finance.allocation.batch.form.validation.error.numeric' })
    : undefined;
};

export const validateNotNegative = (intl) => (value) => {
  return value && (Number.parseFloat(value) < 0)
    ? intl.formatMessage({ id: 'stripes-acq-components.validation.cantBeNegative' })
    : undefined;
};

export const validateRecalculateErrors = () => (_value, allValues, meta) => {
  const recalculateErrorsMap = allValues[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.recalculateErrors];

  return recalculateErrorsMap?.get(meta?.name)?.[0];
};

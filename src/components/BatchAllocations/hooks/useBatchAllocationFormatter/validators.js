import { FUND_STATUSES } from '../../../../Funds/constants';
import { BUDGET_STATUSES } from '../../../Budget/constants';
import { BATCH_ALLOCATION_FIELDS } from '../../constants';

export const validateAllocationAfterField = (intl, rowIndex) => (value, allValues) => {
  const adjustment = allValues?.fyFinanceData?.[rowIndex]?.[BATCH_ALLOCATION_FIELDS.budgetAllocationChange];

  return value && (adjustment > 0 && value < 0)
    ? intl.formatMessage({ id: 'ui-finance.allocation.batch.form.validation.error.negativeAllocation' })
    : undefined;
};

export const validateFundStatus = (intl) => (value) => {
  return value && !Object.values(FUND_STATUSES).includes(value)
    ? intl.formatMessage({ id: 'ui-finance.allocation.batch.form.validation.error.invalidStatus' })
    : undefined;
};

export const validateBudgetStatus = (intl) => (value) => {
  return value && !Object.values(BUDGET_STATUSES).includes(value)
    ? intl.formatMessage({ id: 'ui-finance.allocation.batch.form.validation.error.invalidStatus' })
    : undefined;
};

export const validateNumericValue = (intl) => (value) => {
  return value && Number.isNaN(Number(value))
    ? intl.formatMessage({ id: 'ui-finance.allocation.batch.form.validation.error.numeric' })
    : undefined;
};

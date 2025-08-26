import { FormattedMessage } from 'react-intl';

import {
  getMoneyMultiplier,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

import { ALLOCATION_TYPE } from '../constants';

export const isTransferTransaction = (transactionType) => transactionType === TRANSACTION_TYPES.transfer;
export const isAllocationTransaction = (transactionType) => transactionType === TRANSACTION_TYPES.allocation;
export const isDecreaseAllocationType = (allocationType) => allocationType === ALLOCATION_TYPE.decrease;
export const isIncreaseAllocationType = (allocationType) => allocationType === ALLOCATION_TYPE.increase;
export const isMoveAllocationType = (allocationType) => allocationType === ALLOCATION_TYPE.move;

export const validateAllocationAmount = (
  allocationType,
  budget,
  counterpartyBudget,
  currency,
) => {
  return (value, { fromFundId }) => {
    const multiplier = getMoneyMultiplier(currency);

    /* Calculate the sign based on allocation type and fund ID */
    const sign = (
      isDecreaseAllocationType(allocationType) || (isMoveAllocationType(allocationType) && budget.fundId === fromFundId
      ) ? -1 : 1
    );

    const currentBudgetNewTotalAllocated = (
      Math.round((multiplier * budget.allocated) + (sign * multiplier * value)) / multiplier
    );

    const counterpartyBudgetNewTotalAllocated = (
      Math.round((multiplier * counterpartyBudget?.allocated) + ((-sign) * multiplier * value)) / multiplier
    );

    return value && (currentBudgetNewTotalAllocated < 0 || counterpartyBudgetNewTotalAllocated < 0)
      ? <FormattedMessage id="ui-finance.transaction.validation.totalAllocatedExceeded" />
      : undefined;
  };
};

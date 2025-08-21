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
  currency,
) => {
  return (value, { fromFundId }) => {
    const { allocated, fundId } = budget;
    const multiplier = getMoneyMultiplier(currency);
    const sign = (
      isDecreaseAllocationType(allocationType) || (isMoveAllocationType(allocationType) && fundId === fromFundId
      ) ? -1 : 1
    );
    const newTotalAllocated = Math.round((multiplier * allocated) + (sign * multiplier * value)) / multiplier;

    return value && newTotalAllocated < 0
      ? <FormattedMessage id="ui-finance.transaction.validation.totalAllocatedExceeded" />
      : undefined;
  };
};

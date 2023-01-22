import {
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

import {
  ALLOCATION_TYPE,
} from '../constants';

export const isTransferTransaction = (transactionType) => transactionType === TRANSACTION_TYPES.transfer;
export const isDecreaseAllocationType = (allocationType) => allocationType === ALLOCATION_TYPE.decrease;

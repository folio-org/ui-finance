import escapeRegExp from 'lodash/escapeRegExp';
import { FormattedMessage } from 'react-intl';

import {
  getMoneyMultiplier,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

import { ALLOCATION_TYPE } from '../constants';

/*
 * FieldSelectionFinal's default onFilter (filterSelectValues from stripes-acq-components) only
 * matches against each option's top-level `label`, so once funds are grouped by ledger, it matches
 * against the ledger's label instead of any fund inside it - the filter box would otherwise appear
 * to return no results for any fund name/code search. This mirrors filterSelectValues' matching
 * (case-insensitive substring), but reaches into `options` for grouped entries.
 */
export const filterGroupedFundOptions = (value, dataOptions = []) => {
  if (!value) return dataOptions;

  const regex = new RegExp(escapeRegExp(value), 'i');
  const matchesLabel = ({ label }) => regex.test(label);

  return dataOptions.reduce((acc, opt) => {
    if (opt.options) {
      const filteredOptions = opt.options.filter(matchesLabel);

      if (filteredOptions.length > 0) acc.push({ ...opt, options: filteredOptions });
    } else if (matchesLabel(opt)) {
      acc.push(opt);
    }

    return acc;
  }, []);
};

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

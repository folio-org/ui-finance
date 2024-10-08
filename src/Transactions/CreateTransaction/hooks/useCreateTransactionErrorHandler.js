import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';
import {
  ERROR_CODE_GENERIC,
  getErrorCodeFromResponse,
} from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../../constants';
import { getFundActiveBudget } from '../../../common/utils';

const getGenericErrorPayload = async ({ amountWithCurrency, budgetName }) => ({
  values: {
    amount: amountWithCurrency,
    budgetName,
  },
});

const getNotFoundBudgetErrorPayload = async ({
  amountWithCurrency,
  contragentFund,
  transactionTypeKey,
}) => ({
  id: `ui-finance.transaction.${transactionTypeKey}.${ERROR_CODES.budgetNotFoundForTransaction}`,
  values: {
    amount: amountWithCurrency,
    fundCode: contragentFund?.code,
  },
});

const getNotEnoughMoneyErrorPayload = async (accumulatedData, ky) => {
  const {
    amountWithCurrency,
    budget,
    contragentFundId,
    formValues,
  } = accumulatedData;
  const contragentBudget = contragentFundId && await getFundActiveBudget(ky)(contragentFundId).catch(() => null);

  if (contragentFundId && !contragentBudget) return getNotFoundBudgetErrorPayload(accumulatedData);

  const { toFundId, fromFundId } = formValues;

  const budgets = [budget, contragentBudget].filter(Boolean);
  const toBudgetName = budgets.find(({ fundId }) => fundId === toFundId)?.name;
  const fromBudgetName = budgets.find(({ fundId }) => fundId === fromFundId)?.name;

  return {
    values: {
      amount: amountWithCurrency,
      toBudgetName,
      fromBudgetName,
    },
  };
};

const getSpecifiedErrorPayload = (ky) => async (errorCode, accumulatedData) => {
  const errorHandlersMap = {
    [ERROR_CODES.currentBudgetNotFound]: getNotFoundBudgetErrorPayload,
    [ERROR_CODES.budgetNotFoundForTransaction]: getNotFoundBudgetErrorPayload,
    [ERROR_CODES.budgetRestrictedExpendituresError]: getNotEnoughMoneyErrorPayload,
    [ERROR_CODES.notEnoughMoneyForAllocationError]: getNotEnoughMoneyErrorPayload,
    [ERROR_CODES[ERROR_CODE_GENERIC]]: getGenericErrorPayload,
  };

  const handler = errorHandlersMap[errorCode] || errorHandlersMap[ERROR_CODES[[ERROR_CODE_GENERIC]]];

  return handler(accumulatedData, ky);
};

export const useCreateTransactionErrorHandler = () => {
  const ky = useOkapiKy();

  const handleCreateTransactionErrorResponse = useCallback(async ({
    errorResponse,
    transactionTypeKey,
    ...accumulatedData
  }) => {
    const errorCode = await getErrorCodeFromResponse(errorResponse);
    const { id, values } = await getSpecifiedErrorPayload(ky)(errorCode, { ...accumulatedData, transactionTypeKey });
    const defaultMessageId = `ui-finance.transaction.${transactionTypeKey}.${ERROR_CODES[errorCode] || ERROR_CODES[ERROR_CODE_GENERIC]}`;

    return (
      <FormattedMessage
        id={id || defaultMessageId}
        values={values}
      />
    );
  }, [ky]);

  return {
    handleCreateTransactionErrorResponse,
  };
};

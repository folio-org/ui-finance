import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';
import {
  ERROR_CODE_GENERIC,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../../constants';
import { useCreateTransactionErrorHandler } from './useCreateTransactionErrorHandler';

const FY = 'FY2023';
const fund = { id: 'testFundId', code: 'TEST-A' };
const contragentFund = { id: 'testContragentFundId', code: 'TEST-B' };
const budgetName = `${fund.code}-${FY}`;
const contragentBudgetName = `${contragentFund.code}-${FY}`;

const formValues = {
  fromFundId: contragentFund.id,
  toFundId: fund.id,
  amount: 42,
};

const accumulatedData = {
  amountWithCurrency: formValues.amount,
  fund,
  fundId: fund.id,
  contragentFund,
  contragentFundId: contragentFund.id,
  budget: {
    fundId: fund.id,
    available: 100,
    name: budgetName,
  },
  budgetName,
};

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({
      fundId: contragentFund.id,
      available: 30,
      name: contragentBudgetName,
    }),
  })),
};

const errorMessagesMap = {
  allocation: {
    [ERROR_CODES[ERROR_CODE_GENERIC]]: 'ui-finance.transaction.allocation.genericError',
    [ERROR_CODES.allowableAllocationIdsMismatch]: 'ui-finance.transaction.allocation.allowableAllocationIdsMismatch',
    [ERROR_CODES.budgetNotFoundForTransaction]: 'ui-finance.transaction.allocation.budgetNotFoundForTransaction',
    [ERROR_CODES.currentBudgetNotFound]: 'ui-finance.transaction.allocation.budgetNotFoundForTransaction',
    [ERROR_CODES.notEnoughMoneyForAllocationError]: 'ui-finance.transaction.allocation.notEnoughMoneyForAllocationError',
  },
  transfer: {
    [ERROR_CODES[ERROR_CODE_GENERIC]]: 'ui-finance.transaction.transfer.genericError',
    [ERROR_CODES.budgetNotFoundForTransaction]: 'ui-finance.transaction.transfer.budgetNotFoundForTransaction',
    [ERROR_CODES.budgetRestrictedExpendituresError]: 'ui-finance.transaction.transfer.budgetRestrictedExpendituresError',
    [ERROR_CODES.currentBudgetNotFound]: 'ui-finance.transaction.transfer.budgetNotFoundForTransaction',
    [ERROR_CODES.missingFundId]: 'ui-finance.transaction.transfer.missingFundId',
  },
};

const generateErrorResponseByCode = (code) => ({
  json: () => Promise.resolve({ errors: [{ code }] }),
});

const handleErrorResponseByCode = async (code, result, params = {}) => {
  const { handleCreateTransactionErrorResponse } = result.current;

  const formatted = await handleCreateTransactionErrorResponse({
    ...accumulatedData,
    formValues,
    errorResponse: generateErrorResponseByCode(code),
    ...params,
  });

  return formatted.props;
};

describe('useCreateTransactionErrorHandler', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  describe('Allocations', () => {
    const transactionTypeKey = TRANSACTION_TYPES.allocation.toLowerCase();

    const handleAllocationErrorByCode = (code, result, params = {}) => handleErrorResponseByCode(
      code,
      result,
      {
        ...params,
        transactionTypeKey,
      },
    );

    it('should handle \'allowableAllocationIdsMismatch\' error', async () => {
      const errorCode = ERROR_CODES.allowableAllocationIdsMismatch;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleAllocationErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        budgetName,
      });
    });

    it('should handle \'budgetNotFoundForTransaction\' error', async () => {
      const errorCode = ERROR_CODES.budgetNotFoundForTransaction;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleAllocationErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        fundCode: accumulatedData.contragentFund.code,
      });
    });

    it('should handle \'currentBudgetNotFound\' error', async () => {
      const errorCode = ERROR_CODES.currentBudgetNotFound;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleAllocationErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        fundCode: accumulatedData.contragentFund.code,
      });
    });

    it('should handle \'notEnoughMoneyForAllocationError\' error', async () => {
      const errorCode = ERROR_CODES.notEnoughMoneyForAllocationError;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleAllocationErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        fromBudgetName: contragentBudgetName,
        toBudgetName: budgetName,
      });
    });

    it('should handle \'genericError\' error', async () => {
      const errorCode = ERROR_CODE_GENERIC;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleAllocationErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        budgetName,
      });
    });
  });

  describe('Transfers', () => {
    const transactionTypeKey = TRANSACTION_TYPES.transfer.toLowerCase();

    const handleTransferErrorByCode = (code, result, params = {}) => handleErrorResponseByCode(
      code,
      result,
      {
        ...params,
        transactionTypeKey,
      },
    );

    it('should handle \'genericError\' error', async () => {
      const errorCode = ERROR_CODE_GENERIC;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleTransferErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        budgetName,
      });
    });

    it('should handle \'budgetNotFoundForTransaction\' error', async () => {
      const errorCode = ERROR_CODES.budgetNotFoundForTransaction;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleTransferErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        fundCode: accumulatedData.contragentFund.code,
      });
    });

    it('should handle \'budgetRestrictedExpendituresError\' error', async () => {
      const errorCode = ERROR_CODES.budgetRestrictedExpendituresError;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleTransferErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        fromBudgetName: contragentBudgetName,
        toBudgetName: budgetName,
      });
    });

    it('should handle \'currentBudgetNotFound\' error', async () => {
      const errorCode = ERROR_CODES.currentBudgetNotFound;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleTransferErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        fundCode: accumulatedData.contragentFund.code,
      });
    });

    it('should handle \'missingFundId\' error', async () => {
      const errorCode = ERROR_CODES.missingFundId;

      const { result } = renderHook(() => useCreateTransactionErrorHandler());

      const { id, values } = await handleTransferErrorByCode(errorCode, result);

      expect(id).toEqual(errorMessagesMap[transactionTypeKey][errorCode]);
      expect(values).toEqual({
        amount: accumulatedData.amountWithCurrency,
        budgetName,
      });
    });
  });
});

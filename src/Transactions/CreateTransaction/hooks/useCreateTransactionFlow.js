import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { noop } from 'lodash';

import { useOkapiKy } from '@folio/stripes/core';
import { useModalToggle } from '@folio/stripes-acq-components';

import { getFundActiveBudget } from '../../../common/utils';
import { ALLOCATION_TYPE } from '../../constants';
import { createTransactionFlow } from '../createTransactionFlow';
import {
  isDecreaseAllocationType,
  isTransferTransaction,
} from '../utils';

const ALLOCATIONS_WITHIN_ONE_FUND = [ALLOCATION_TYPE.increase, ALLOCATION_TYPE.decrease];

const getTransactionFundActiveBudget = (ky) => (transactionFundId) => {
  return getFundActiveBudget(ky)(transactionFundId).catch(({ response }) => { throw response; });
};

export const useCreateTransactionFlow = () => {
  const ky = useOkapiKy();
  const [isConfirmCreateTransactionModalOpen, toggleConfirmModal] = useModalToggle();
  const [isLoading, setIsLoading] = useState(false);
  const transactionCreateRef = useRef({ resolve: Promise.resolve, reject: Promise.reject });

  const showConfirmTransactionCreateModal = useCallback(({ abort }) => {
    return new Promise((resolve, reject) => {
      transactionCreateRef.current = { resolve, reject };

      toggleConfirmModal();
    })
      .catch(abort)
      .finally(toggleConfirmModal);
  }, [toggleConfirmModal]);

  const confirmModalCreateTransaction = useCallback(() => {
    transactionCreateRef.current.resolve();
  }, []);

  const cancelModalCreateTransaction = useCallback(() => {
    transactionCreateRef.current.reject();
  }, []);

  const prepareContragentBudgetDataStep = useCallback(async (_formValues, { contragentFundId, allocationType }) => {
    const shouldFetchContragentBudget = !ALLOCATIONS_WITHIN_ONE_FUND.includes(allocationType);

    const contragentBudget = shouldFetchContragentBudget
      ? await getTransactionFundActiveBudget(ky)(contragentFundId)
      : {};

    return { contragentBudget };
  }, [ky]);

  const checkTransactionResultAvailableAmountStep = useCallback(async (formValues, accumulatedData, { abort }) => {
    const {
      transactionType,
      ...data
    } = accumulatedData;

    const isCheckRequired = isTransferTransaction(transactionType);

    if (isCheckRequired) {
      // TODO: check resulting available amount for budgets (UIF-427)
      const isAmountWillBeNegative = noop(formValues, data);

      if (isAmountWillBeNegative) await showConfirmTransactionCreateModal({ abort });
    }
  }, [showConfirmTransactionCreateModal]);

  const prepareResultBudgetNameStep = useCallback(async (formValues, accumulatedData) => {
    const {
      allocationType,
      budgetName,
      contragentBudget,
      fundId,
    } = accumulatedData;

    const resultFundFieldName = isDecreaseAllocationType(allocationType)
      ? 'fromFundId'
      : 'toFundId';

    const resultBudgetName = formValues[resultFundFieldName] === fundId
      ? budgetName
      : contragentBudget?.name;

    return { resultBudgetName };
  }, []);

  const runCreateTransactionFlow = useCallback((finalStep = noop) => async (formValues, accumulatedData) => {
    setIsLoading(true);

    const result = await createTransactionFlow(
      prepareContragentBudgetDataStep,
      checkTransactionResultAvailableAmountStep,
      prepareResultBudgetNameStep,
      finalStep,
    )(
      formValues,
      accumulatedData,
      { onError: setIsLoading },
    );

    setIsLoading(false);

    return result;
  }, [
    checkTransactionResultAvailableAmountStep,
    prepareContragentBudgetDataStep,
    prepareResultBudgetNameStep,
  ]);

  return {
    runCreateTransactionFlow,
    confirmModalCreateTransaction,
    isConfirmCreateTransactionModalOpen,
    isLoading,
    cancelModalCreateTransaction,
  };
};

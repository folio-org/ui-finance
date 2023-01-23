import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  getMoneyMultiplier,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { getFundActiveBudget } from '../../../common/utils';
import { ALLOCATION_TYPE } from '../../constants';
import { createTransactionFlow } from '../createTransactionFlow';
import {
  isDecreaseAllocationType,
  isTransferTransaction,
} from '../utils';

const ALLOCATIONS_WITHIN_ONE_FUND = [ALLOCATION_TYPE.increase, ALLOCATION_TYPE.decrease];

const CONFIRM_MODAL_TYPES = {
  negativeAvailableAmount: 'negativeAvailableAmount',
}

const getTransactionFundActiveBudget = (ky) => (transactionFundId) => {
  return getFundActiveBudget(ky)(transactionFundId).catch(({ response }) => { throw response; });
};

const getBudgetsNamesWithNegativeAmmount = (formVales, accumulatedData, currency) => {
  const { amount, fromFundId } = formVales;
  const { budget, contragentBudget } = accumulatedData;
  const multiplier = getMoneyMultiplier(currency);

  return [budget, contragentBudget]
    .map(({ available, name, fundId }) => {
      const sign = fromFundId === fundId ? -1 : 1;

      return {
        name,
        available: Math.round((multiplier * available) + ( sign * multiplier * amount)) / multiplier,
      }
    })
    .reduce((acc, { name, available }) => available < 0 ? [...acc, name] : acc, []);
}

export const useCreateTransactionFlow = () => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const stripes = useStripes();

  const [isConfirmCreateTransactionModalOpen, toggleConfirmModal] = useModalToggle();
  const [confirmModalProps, setConfirmModalProps] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const transactionCreateRef = useRef({ resolve: Promise.resolve, reject: Promise.reject });

  const confirmModalCreateTransaction = useCallback(() => {
    transactionCreateRef.current.resolve();
  }, []);

  const cancelModalCreateTransaction = useCallback(() => {
    transactionCreateRef.current.reject();
  }, []);

  const showConfirmTransactionCreateModal = useCallback(({ abort, values, confirmModalType }) => {
    setConfirmModalProps({
      heading: intl.formatMessage({ id: `ui-finance.transaction.confirmModal.${confirmModalType}.heading` }),
      message: intl.formatMessage({ id: `ui-finance.transaction.confirmModal.${confirmModalType}.message` }, values),
      confirmLabel: intl.formatMessage({ id: 'ui-finance.transaction.button.confirm' }),
      onCancel: cancelModalCreateTransaction,
      onConfirm: confirmModalCreateTransaction,
    });

    return new Promise((resolve, reject) => {
      transactionCreateRef.current = { resolve, reject };

      toggleConfirmModal();
    })
      .catch(abort)
      .finally(toggleConfirmModal);
  }, [toggleConfirmModal]);

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
      const budgetNamesWithResultingNegativeAmount = getBudgetsNamesWithNegativeAmmount(formValues, data, stripes.currency);
      const isAmountWillBeNegative = !!budgetNamesWithResultingNegativeAmount.length;

      if (isAmountWillBeNegative) {
        const values = { budgetName: budgetNamesWithResultingNegativeAmount.join(', ') };

        await showConfirmTransactionCreateModal({
          abort,
          confirmModalType: CONFIRM_MODAL_TYPES.negativeAvailableAmount,
          values
        })
      };
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
    confirmModalProps,
    isConfirmCreateTransactionModalOpen,
    isLoading,
    runCreateTransactionFlow,
  };
};

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { omit } from 'lodash';

import { ConfirmationModal } from '@folio/stripes/components';
import {
  getAmountWithCurrency,
  getFundsForSelect,
  TRANSACTION_TYPES,
  useAllFunds,
  useShowCallout,
} from '@folio/stripes-acq-components';
import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import {
  allocationsResource,
  budgetResource,
  encumbrancesResource,
  transfersResource,
} from '../../common/resources';
import {
  TRANSACTION_SOURCE,
} from '../constants';
import CreateTransactionModal from './CreateTransactionModal';
import {
  useCreateTransactionErrorHandler,
  useCreateTransactionFlow,
} from './hooks';
import { isDecreaseAllocationType } from './utils';

export const CreateTransactionContainer = ({
  allocationType,
  budget,
  budgetName,
  fetchBudgetResources,
  fiscalYearCurrency,
  fiscalYearId,
  fundId,
  labelId,
  mutator,
  onClose,
  stripes,
  transactionType,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const locale = stripes.locale;
  const currency = fiscalYearCurrency || stripes.currency;
  const transactionTypeKey = transactionType.toLowerCase();

  const { funds } = useAllFunds();
  const { handleCreateTransactionErrorResponse } = useCreateTransactionErrorHandler();
  const {
    confirmModalProps,
    isConfirmCreateTransactionModalOpen,
    isLoading,
    runCreateTransactionFlow,
  } = useCreateTransactionFlow();

  const initialValues = useMemo(() => {
    const values = isDecreaseAllocationType(allocationType) ? { fromFundId: fundId } : { toFundId: fundId };

    return ({
      fundId,
      ...values,
    });
  }, [fundId, allocationType]);

  const saveTransactionStep = useCallback(async (formValues, { resultBudgetName }) => {
    const mutatorObject = mutator[transactionType];

    const transfer = await mutatorObject.POST({
      ...omit(formValues, 'fundId'),
      fiscalYearId,
      currency,
      transactionType,
      source: TRANSACTION_SOURCE.user,
    });

    showCallout({
      messageId: `ui-finance.transaction.${transactionTypeKey}.hasBeenCreated`,
      values: {
        amount: getAmountWithCurrency(locale, currency, transfer.amount),
        budgetName: resultBudgetName,
      },
    });
  },
  [
    currency,
    fiscalYearId,
    locale,
    mutator,
    showCallout,
    transactionType,
    transactionTypeKey,
  ]);

  const onSubmitTransactionForm = useCallback(async (formValues) => {
    const { toFundId, fromFundId } = formValues;

    console.log(toFundId, fromFundId)

    const fund = funds.find(({ id }) => id === fundId);
    const contragentFundId = [toFundId, fromFundId].find((_fundId) => _fundId !== fundId);
    const contragentFund = funds.find(({ id: cFundId }) => cFundId === contragentFundId);

    const amountWithCurrency = getAmountWithCurrency(locale, currency, formValues.amount);

    const accumulatedData = {
      allocationType,
      amountWithCurrency,
      budget,
      budgetName,
      fund,
      fundId,
      contragentFund,
      contragentFundId,
      transactionType,
    };

    await runCreateTransactionFlow(saveTransactionStep)(formValues, accumulatedData)
      .then(({ isAborted }) => {
        if (!isAborted) {
          onClose();
          fetchBudgetResources();
        }
      })
      .catch(async (errorResponse) => {
        const message = await handleCreateTransactionErrorResponse({
          ...accumulatedData,
          errorResponse,
          formValues,
          transactionTypeKey,
        });

        showCallout({ message, type: 'error' });
      });
  }, [
    allocationType,
    budget,
    budgetName,
    currency,
    fetchBudgetResources,
    fundId,
    funds,
    handleCreateTransactionErrorResponse,
    locale,
    onClose,
    runCreateTransactionFlow,
    saveTransactionStep,
    showCallout,
    transactionType,
    transactionTypeKey,
  ]);

  const fundsOptions = useMemo(() => getFundsForSelect(funds), [funds]);

  return (
    <>
      <CreateTransactionModal
        fundId={fundId}
        fundsOptions={fundsOptions}
        initialValues={initialValues}
        isLoading={isLoading}
        onClose={onClose}
        onSubmit={onSubmitTransactionForm}
        title={intl.formatMessage({ id: labelId })}
        allocationType={allocationType}
      />

      {
        isConfirmCreateTransactionModalOpen && (
          <ConfirmationModal
            open
            {...confirmModalProps}
          />
        )
      }
    </>
  );
};

CreateTransactionContainer.manifest = Object.freeze({
  budget: budgetResource,
  [TRANSACTION_TYPES.allocation]: allocationsResource,
  [TRANSACTION_TYPES.encumbrance]: encumbrancesResource,
  [TRANSACTION_TYPES.transfer]: transfersResource,
});

CreateTransactionContainer.propTypes = {
  budget: PropTypes.object.isRequired,
  budgetName: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string.isRequired,
  fundId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  stripes: stripesShape.isRequired,
  fetchBudgetResources: PropTypes.func.isRequired,
  fiscalYearCurrency: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  allocationType: PropTypes.string,
};

export default stripesConnect(CreateTransactionContainer);
